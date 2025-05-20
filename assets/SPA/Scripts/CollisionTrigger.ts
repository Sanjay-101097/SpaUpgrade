import { _decorator, Collider, Component, ITriggerEvent, MeshCollider, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CollisionTrigger')
export class CollisionTrigger extends Component {
    start() {
        const collider = this.getComponent(Collider);
        if (collider) {
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
            collider.on('onTriggerStay', this.onTriggerStay, this);
            collider.on('onTriggerExit', this.onTriggerExit, this);
        }
    }

    onTriggerEnter(event: ITriggerEvent) {
        console.log('Triggered by:', event.otherCollider.node.name);
        if(this.node.active)
            this.enable = true;
    }

    onTriggerStay(event: ITriggerEvent) {
        
        
    }

    onTriggerExit(event: ITriggerEvent) {
        console.log('Exited trigger of:', event.otherCollider.node.name);
    }

    enable : boolean = false;
    dt:number = 0;
    update(deltaTime: number) {
        if(this.enable){

            this.dt += deltaTime;
            if(this.dt >0.7){
                this.enable = false
                let node = this.node.parent.children[1]
                 this.node.parent.children[1].active = true;
                 tween(node).to(0.3,{scale:new Vec3(1,1,1)}).call(()=>{
                    node.getComponent(MeshCollider).enabled = true;

                    node.setRotationFromEuler(0,1,0);
                    this.node.active = false
                 }).start();
            }

        }
    }
}


