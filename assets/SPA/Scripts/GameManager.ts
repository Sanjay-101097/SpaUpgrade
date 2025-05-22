import { _decorator, AnimationClip, Collider, Component, instantiate, Label, Node, Prefab, SkeletalAnimation, tween, Vec3 } from 'cc';
import { CharacterMovement } from './controller/CharacterMovement';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    private customerPos: Vec3[] = [new Vec3(0.45, 0.3, 8), new Vec3(6.35, 0.3, 8), new Vec3(-11, 0.3, 4.8), new Vec3(-12, 0, -9), new Vec3(-12, 0, -7)];

    @property(Node)
    customers: Node[] = []

    @property(Node)
    NoBal: Node = null;

    @property(Node)
    Desk: Node = null;


    @property(Prefab)
    Cash: Prefab = null;

    @property(Label)
    Bal: Label = null;

    @property(AnimationClip)
    customersAnim: AnimationClip[] = [];

    private waitingCust: Node[] = []

    private id = 3;
    public Balance = 100;

    protected start(): void {
        const collider = this.Desk.getComponent(Collider);
        if (collider) {
            collider.on('onTriggerEnter', this.counter, this);
        }
    }

    moveAnim(Id, node) {
        const targetCustomer = this.customers[Id];
        let destination = this.customerPos[Id];
        const anim = targetCustomer.getComponent(SkeletalAnimation);
        for (let i = 0; i < this.customersAnim.length; ++i) {
            const clip = this.customersAnim[i];
            if (clip && !anim.getState(clip.name)) {
                anim.addClip(clip);
            }
        }

        if (this.customersAnim[0]) {
            anim.play(this.customersAnim[0].name);
        }

        anim.crossFade(this.customersAnim[1].name, 0.1);

        // Move the character
        tween(targetCustomer)
            .to(0.8, { position: new Vec3(destination.x, targetCustomer.position.y, targetCustomer.position.z) }).call(() => {
                const dir = new Vec3();
                Vec3.subtract(dir, destination, targetCustomer.worldPosition);
                Vec3.normalize(dir, dir);

                const angleY = Math.atan2(dir.x, dir.z) * 180 / Math.PI;

                targetCustomer.eulerAngles = new Vec3(0, angleY, 0);
            })
            .to(3, { position: destination }).call(() => {
                anim.crossFade(this.customersAnim[2].name, 0.1);
                targetCustomer.eulerAngles = new Vec3(0, 90, 0);

            }).delay(0.1).call(() => {
                if (Id < 2) {
                    tween(node.children[0]).to(0.2, { eulerAngles: new Vec3(0, -5, 0) }).start();
                    tween(targetCustomer).to(0.2, { eulerAngles: new Vec3(0, -15, 0) }).start();
                }

            }).delay(2).call(() => {
                if (Id < 2) {
                    tween(node.children[0]).to(0.3, { eulerAngles: new Vec3(0, 90, 0) }).start();
                    tween(targetCustomer).to(0.3, { eulerAngles: new Vec3(0, 90, 0) }).call(() => {
                        destination = this.customerPos[this.id];
                        this.id += 1;
                        anim.crossFade(this.customersAnim[1].name, 0.1);
                        const dir = new Vec3();
                        Vec3.subtract(dir, destination, targetCustomer.worldPosition);
                        Vec3.normalize(dir, dir);

                        const angleY = Math.atan2(dir.x, dir.z) * 180 / Math.PI;

                        targetCustomer.eulerAngles = new Vec3(0, angleY, 0);
                        tween(targetCustomer)
                            .to(3, { position: destination })
                            .call(() => {
                                anim.crossFade(this.customersAnim[0].name, 0.1);
                                targetCustomer.eulerAngles = new Vec3(0, 180, 0);
                                this.waitingCust.push(targetCustomer);
                            })
                            .start();


                    }).start();
                }
            })
            .start();
    }


    counter() {
        this.Desk.getComponent(Collider).off('onTriggerEnter', this.counter, this);
        CharacterMovement.id +=1;
        if (this.waitingCust.length > 0) {
            this.Balance += 50;
            this.schedule(() => {
                let cashNode = instantiate(this.Cash);
                this.node.scene.addChild(cashNode);
                cashNode.setPosition(-11, 3, -10)
                tween(cashNode).to(0.3, { position: new Vec3(-11, 12, -17) }).call(()=>{
                    cashNode.destroy();
                }).start();
            },0.1,3)


            this.Bal.string = "$" + this.Balance.toString();
            this.waitingCust.splice(0, 1);
        }

    }

    update(deltaTime: number) {

    }
}

