import { _decorator, AudioClip, AudioSource, Collider, Component, easing, ITriggerEvent, MeshCollider, MeshRenderer, Node, tween, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { CharacterMovement } from './controller/CharacterMovement';
const { ccclass, property } = _decorator;

@ccclass('CollisionTrigger')
export class CollisionTrigger extends Component {

    @property(GameManager)
    gameManager: GameManager = null;

    @property(Node)
    Particle: Node = null;

    @property(AudioClip)
    audio: AudioClip = null;

    audiosource: AudioSource;

    public static  Unlock = 0;

    start() {
        this.audiosource = this.node.getComponent(AudioSource);
        const collider = this.getComponent(Collider);
        if (collider) {
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    onTriggerEnter(event: ITriggerEvent) {
        // console.log('Triggered by:', event.otherCollider.node.name);
        // if(event.otherCollider.name != "Serenity_") return;
        if (this.node.parent.active) {

            CharacterMovement.id += 1;
            if (this.node.parent.parent.name == "MassageUpgrade1" || this.node.parent.parent.name == "Sofa") {
                if (this.gameManager.Balance >= 100) {
                     this.gameManager.Balance -= 100;
                    CollisionTrigger.Unlock+=1;


                } else {
                    CharacterMovement.id = 2;
                     tween(this.gameManager.NoBal).to(0.3, { scale: new Vec3(1, 1, 1) }).delay(0.8).call(() => {
                        this.gameManager.NoBal.setScale(0, 0, 0);
                    }).start();
                    return;
                }


            } else {
                if (this.gameManager.Balance >= 50) {
                    this.gameManager.Balance -= 50;  
                    CollisionTrigger.Unlock+=1;       
                } else {
                    CharacterMovement.id = 2;
                     tween(this.gameManager.NoBal).to(0.3, { scale: new Vec3(1, 1, 1) }).delay(0.8).call(() => {
                        this.gameManager.NoBal.setScale(0, 0, 0);
                    }).start();
                     return;
                }

            }

            this.enable = true;
            this.getComponent(Collider).off('onTriggerEnter', this.onTriggerEnter, this);
        }
        this.gameManager.Bal.string = "$" + this.gameManager.Balance.toString();

    }


    enable: boolean = false;
    dt: number = 0;
    update(deltaTime: number) {
        if (this.enable) {

            this.dt += deltaTime;
            if (this.dt > 0.7) {
                this.enable = false
                this.audiosource.playOneShot(this.audio, 0.6);
                if (this.node.parent.parent.name == "MassageUpgrade1") {
                    let UpgNode = this.node.parent.parent.parent.getChildByName("MassageUpgrade2");
                    this.Particle.active = true;
                     this.node.parent.parent.active = false;
                    tween(UpgNode)
                        .to(0.5, { scale: new Vec3(100, 100, 100) }, { easing: "quadOut" })
                        .call(() => {
                           UpgNode.setRotationFromEuler(-90, 1, 0);
                            this.node.parent.active = false;

                        }).start();


                } else if (this.node.parent.parent.name == "Sofa") {
                    let UpgNode = this.node.parent.parent.parent.getChildByName("SofaUpgrade2")
                    this.Particle.active = true;
                    this.node.parent.parent.active = false;
                    tween(UpgNode)
                        .to(0.5, { scale: new Vec3(24, 18, 24) }, { easing: "quadOut" })
                        .call(() => {
                            UpgNode.setRotationFromEuler(-90, 1, 0);
                            this.node.parent.active = false;
                        }).start();

                } else {
                    let node = this.node.parent.parent.children[1]
                    node.active = true;
                    //  this.scheduleOnce(()=>{
                    this.node.parent.parent.children[2].active = true;
                    //  },0.5)
                    let scaleval = new Vec3(2.5, 2.5, 2.5);;

                    this.node.getComponent(MeshRenderer).enabled = false;
                    tween(node).to(0.5, { scale: scaleval }, { easing: "quadOut" }).call(() => {
                        // if (this.node.parent.name != "station_pedia") {
                        // node.getComponent(MeshCollider).enabled = true;
                        // }
                        // let idx;
                        // if (this.node.name == "Upgrade1") {
                        //     idx = 1;
                        // } else if (this.node.name == "Upgrade") {
                        //     idx = 0;
                        // } else {
                        //     idx = 2;
                        // }

                        node.setRotationFromEuler(0, 1, 0);
                        this.node.parent.active = false
                    }).start();
                }

            }

        }
    }
}


