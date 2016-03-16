import factory from '../external/buildFactory'
import disable from './DisableDirective'
import rangeFilter from './RangeFilter'
import plainFilter from './PlainFilter'
import cleanStyle from './CleanStyleDirective'
//import * as utils from '../utils'


export default angular.module('Fermi.core', [])
	.directive('disabled', factory.directive(disable))
	.directive('cleanStyle', factory.directive(cleanStyle))
    .filter('range', rangeFilter)
	.filter('plain', plainFilter)
	.name;
