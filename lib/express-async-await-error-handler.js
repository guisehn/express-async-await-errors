'use strict'

// Catches error in async routes to remove the need to wrap the entire route code
// into a try-catch statement that calls next(err). It works for non-async functions
// as well without changing their normal behavior.
// Example of usage:
//
// ```
// const router = express.Router()
// async function myFirstAsyncEndpoint () {
//   throw new Error('my async error will be detected by express :)')
// }
// async function mySecondAsyncEndpoint () {
//   throw new Error('express will never detect that this function failed :(')
// }
// router.get('/endpoint1', catchRouteErrors(myFirstAsyncEndpoint))
// router.get('/endpoint2', mySecondAsyncEndpoint)
// ```
function catchRouteErrors (routeFunction) {
  if (routeFunction.constructor.name !== 'AsyncFunction') {
    return routeFunction
  }

  return async (req, res, next) => {
    try {
      await routeFunction(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

// Implements 'catchRouteErrors' to all endpoints of a given router
// Example of usage:
//
// ```
// const router = express.Router()
// enableForRouter(router)
// async function myFirstAsyncEndpoint () {
//   throw new Error('my async error will be detected by express :)')
// }
// async function mySecondAsyncEndpoint () {
//   throw new Error('my async error will be detected too :)')
// }
// router.get('/endpoint1', myFirstAsyncEndpoint)
// router.get('/endpoint2', mySecondAsyncEndpoint)
// ```
function catchAsyncErrorsOnRouter (router) {
  const verbs = ['get', 'post', 'put', 'delete']

  verbs.forEach(verb => {
    if (router[verb]) {
      let originalFunction = router[verb]

      router[verb] = function () {
        let adjustedArguments = Array.prototype.slice.call(arguments)

        for (let i = 0, j = adjustedArguments.length; i < j; i++) {
          adjustedArguments[i] = catchRouteErrors(adjustedArguments[i])
        }

        originalFunction.apply(router, adjustedArguments)
      }
    }
  })

  return router
}

module.exports = { catchRouteErrors, catchAsyncErrorsOnRouter }
