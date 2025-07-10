import autoHeight from '@/directives/autoHeight.js'

export default function installDirectives(app) {
  app.directive('autoHeight', autoHeight)
}
