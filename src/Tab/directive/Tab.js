import tabs from '../template/tabs.html'
import tab from '../template/tab.html'

export class Tabs{
    constructor(){
        this.replace=true
        this.restrict='EA'
        this.template=tabs
        this.controller.$inject=['$scope']
        this.transclude=true
        this.scope={}
    }

    controller($scope){
        $scope.items=[]
        $scope.activedItem=null

        $scope.addItem= (item) => {
            if(item.actived){
                $scope.items.forEach(e=>e.actived=false)
            }

            if($scope.items.length===0){
                item.actived=true
            }

            $scope.items.push(item)
        }

        $scope.switchState=(index,tabHeaders)=>{
            if($scope.items[index].disable)
                return;

            $scope.$apply(()=>{
                $scope.activedItem=$scope.items[index]
                $scope.items.forEach((e,i)=>e.actived=i===index)
            })
        }
    }

    link(scope, elem, attrs, ctrl){
        var ul=elem.find('ul')

        ul.bind('click',(evt)=>{
            var target=evt.target
            var children=ul.children()
            if(target.tagName==='A'){
                var node=angular.element(evt.target)
                var index=~~node.attr('data-index')
                scope.switchState(index,children)
            }
        })
    }
}

export class Tab{
    constructor(utils){
        this.restrict='EA'
        this.require='^fermiTab'
        this.replace=true
        this.template=tab
        this.controller.$inject=['$scope']
        this.transclude=true
        this.utils=utils
    }

    controller($scope){}

    link(scope,element,attrs,parentCtrl){
        var header=attrs.header
        var disable=this.utils.DOMState(attrs,'disable')
        var actived=this.utils.DOMState(attrs,'actived')

        var item={
            display:null,
            disable:false,
            content:element
        }

        Object.defineProperty(item,'actived',{
            get:() => {
                return actived
            },
            set:(newValue) => {
                if(actived===newValue)
                    return;
                if(newValue)
                    element.removeClass('hide').addClass('show')
                else
                    element.removeClass('show').addClass('hide')
                actived=newValue
            },
            enumerable: true,
            configurable: true
        })

        item.actived=actived
        item.display=header
        item.disable=disable

        var parent=scope.$parent
        parent.addItem(item)
    }
}

Tab.$inject=['fermi.Utils']
