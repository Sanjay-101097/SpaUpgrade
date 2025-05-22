import { _decorator, Collider, Component, easing, ITriggerEvent, MeshCollider, MeshRenderer, Node, tween, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { CharacterMovement } from './controller/CharacterMovement';
const { ccclass, property } = _decorator;

@ccclass('CollisionTrigger')
export class CollisionTrigger extends Component {

    @property(GameManager)
    gameManager:GameManager = null;
    start() {
        const collider = this.getComponent(Collider);
        if (collider) {
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
            // collider.on('onTriggerStay', this.onTriggerStay, this);
            // collider.on('onTriggerExit', this.onTriggerExit, this);
        }
    }

    onTriggerEnter(event: ITriggerEvent) {
        // console.log('Triggered by:', event.otherCollider.node.name);
        if(this.node.active && this.gameManager.Balance>0){
            CharacterMovement.id  +=1;
            this.gameManager.Balance -=50;
            this.enable = true;
            this.getComponent(Collider).off('onTriggerEnter', this.onTriggerEnter, this);
        }else{
            tween(this.gameManager.NoBal).to(0.3,{scale:new Vec3(1,1,1)}).delay(0.8).call(()=>{
                this.gameManager.NoBal.setScale(0,0,0);
            }).start();
        }
        this.gameManager.Bal.string = "$"+this.gameManager.Balance.toString();
          
    }

    onTriggerStay(event: ITriggerEvent) {
        
        
    }

    onTriggerExit(event: ITriggerEvent) {
        // console.log('Exited trigger of:', event.otherCollider.node.name);
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
                 this.scheduleOnce(()=>{
                    this.node.parent.children[2].active = true;
                 },0.5)
                 let scaleval;
                 if(this.node.parent.name == "station_pedia"){
                    scaleval = new Vec3(2.5,2.5,2.5);
                 }else{
                    scaleval = new Vec3(1,1,1);
                 }
                 this.node.getComponent(MeshRenderer).enabled = false;
                 tween(node).to(0.5,{scale:scaleval},{easing: "quadOut"}).call(()=>{
                    if(this.node.parent.name != "station_pedia"){
                        node.getComponent(MeshCollider).enabled = true;
                    }
                    let idx;
                    if(this.node.name == "Upgrade1"){
                        idx = 1;
                    }else if(this.node.name == "Upgrade"){
                        idx = 0;
                    }else{
                         idx = 2;
                    }
                    this.gameManager.moveAnim(idx,this.node.parent.children[1])
                    node.setRotationFromEuler(0,1,0);
                    this.node.active = false
                 }).start();
            }

        }
    }
}


