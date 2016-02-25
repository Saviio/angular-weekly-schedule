import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import {
    on,
    noop,
    query,
    addClass,
    removeClass,
    getDOMState
} from '../../utils'


class fakeEvent{
    constructor(checked){
        this.target = {
            checked:!!checked
        }
    }

    preventDefault(){}
    stopPropagation(){}
}

export class Checkbox{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            onchange:'=?',
            label:'@',
            control:'=?'
        }
        this.template = template
    }

    compile($tElement, tAttrs, transclude){
        this.rootDOM = $tElement[0]
        this.checkboxElem = this.rootDOM::query('.fm-checkbox')
        this.input = this.rootDOM::query('input[type=checkbox]')
        return this.link
    }

    @dependencies('$scope')
    controller(scope){
        this.checked = this.rootDOM::getDOMState('default') || false
        this.disabled = !!(this.rootDOM::getDOMState('disabled') || false)

        scope.control = {
            disable:() => {
                this.disabled = true
                this.rootDOM.setAttribute('disabled', 'disabled')
            },
            allow:() => {
                this.disabled = false
                this.rootDOM.removeAttribute('disabled')
            }
        }

        Object.defineProperty(scope.control,'checked', {
            get:() => this.checked,
            set:(value) => this.handle(new fakeEvent(value))
        })

        this.callback = typeof scope.onchange === 'function'
        ? scope.onchange
        : noop
    }

    link(scope, $elem, attrs, ctrl){
        this.input.checked = this.checked
        if(this.checked) this.check()

        this.input::on('change', ::this.handle)
    }

    check(){
        this.checkboxElem::addClass('fm-checkbox-checked')
    }

    unCheck(){
        this.checkboxElem::removeClass('fm-checkbox-checked')
    }

    handle(e){
        e.stopPropagation()
        e.preventDefault()

        if(this.disabled || this.checked === e.target.checked) return

        this.checked = e.target.checked
        this.checked ? this.check() : this.unCheck()
        this.callback(this.checked)
    }
}
