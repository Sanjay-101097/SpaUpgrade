import { _decorator, AnimationClip, AudioClip, AudioSource, Collider, Component, instantiate, Label, Node, Prefab, SkeletalAnimation, sys, tween, Vec3 } from 'cc';
import { CharacterMovement } from './controller/CharacterMovement';
import { CollisionTrigger } from './CollisionTrigger';
const { ccclass, property } = _decorator;
import {super_html_playable} from './super_html_playable';
@ccclass('GameManager')
export class GameManager extends Component {

    private customerPos: Vec3[] = [new Vec3(10.5, 0, -3.8), new Vec3(10.5, 0, 2.3), new Vec3(-7, 2.5, -13), new Vec3(-20, 0, -12), new Vec3(-20, 0, -10), new Vec3(-20, 0, -8)];

    //[init(-26,0,-8),1st person(10.5,0,-3.6), 2nd person{ 1stpos(1,0,-8),  2ndpos(10.5,0,2.5)},3rd person(-7.3,2.7,-13)]

    @property(Node)
    customers: Node[] = []

    @property(Node)
    Upgrades: Node[] = []

    @property(Node)
    NoBal: Node = null;

    @property(Node)
    canvas: Node = null;

    @property(Node)
    Desk: Node = null;

    @property(AudioClip)
    audio: AudioClip = null;

    audiosource: AudioSource;

    @property(Prefab)
    Cash: Prefab = null;

    @property(Label)
    Bal: Label = null;

    @property(AnimationClip)
    customersAnim: AnimationClip[] = [];

    private waitingCust: Node[] = []

    private id = 3;
    public Balance = 100;
    super_html_playable: super_html_playable = new super_html_playable();


 

    protected start(): void {

        this.Upgrades.forEach(Unode => {
            tween(Unode)
                .then(
                    tween()
                        .to(0.6, { scale: new Vec3(1.1, 1.1, 1) })
                        .to(0.3, { scale: new Vec3(1, 1, 1) })
                )
                .repeatForever()
                .start();
        });


        this.audiosource = this.node.getComponent(AudioSource);
        const collider = this.Desk.getComponent(Collider);
        if (collider) {
            collider.on('onTriggerEnter', this.counter, this);
        }

        let idx = 0;
        this.schedule(() => {
            this.moveAnim(idx)
            idx += 1;
        }, 1, 2, 1)

    }

    moveAnim(Id) {
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
        const dir = new Vec3();
        Vec3.subtract(dir, destination, targetCustomer.worldPosition);
        Vec3.normalize(dir, dir);

        const angleY = Math.atan2(dir.x, dir.z) * 180 / Math.PI;

        targetCustomer.eulerAngles = new Vec3(0, angleY, 0);
        let dummydes
        if (Id == 2) {
            dummydes = new Vec3(destination.x - 1.5, 0, destination.z);
        } else {
            dummydes = new Vec3(destination.x + 1, 0, destination.z - 1);
        }

        // Move the character
        tween(targetCustomer)
            .to(5, { position: dummydes }, { easing: "linear" }).call(() => {
                anim.crossFade(this.customersAnim[2].name, 0.1);
                targetCustomer.setPosition(destination);
                targetCustomer.eulerAngles = new Vec3(0, 90, 0);
                if (Id == 2) {
                    targetCustomer.eulerAngles = new Vec3(90, 0, 0);
                    anim.crossFade(this.customersAnim[0].name, 0.1);
                }

            })
            .delay(3).call(() => {
                if (Id <= 2) {
                    if (Id == 2) {
                        targetCustomer.eulerAngles = new Vec3(0, 90, 0);
                    }
                    targetCustomer.setPosition(targetCustomer.x + 1, targetCustomer.y, targetCustomer.z - 1)
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

    MoveoutAnim() {
        if (!this.waitingCust.length) return;
        const targetCustomer = this.waitingCust[0];
        this.waitingCust.splice(0, 1);
        let destination = new Vec3(-25, 0, -5);
        const anim = targetCustomer.getComponent(SkeletalAnimation);
        anim.crossFade(this.customersAnim[1].name, 0.1);
        const dir = new Vec3();
        Vec3.subtract(dir, destination, targetCustomer.worldPosition);
        Vec3.normalize(dir, dir);
        const angleY = Math.atan2(dir.x, dir.z) * 180 / Math.PI;

        targetCustomer.eulerAngles = new Vec3(0, angleY, 0);
        tween(targetCustomer)
            .to(1, { position: destination }, { easing: "linear" })
            .call(() => {

                if (!this.waitingCust.length) {
                    this.id = 3;
                    this.customers[0].setPosition(-26.06, 0, -8.631);
                    this.customers[1].setPosition(-26.06, 0, -8.631);
                    this.customers[0].setRotationFromEuler(0, 90, 0)
                    this.customers[1].setRotationFromEuler(0, 90, 0)
                    // this.customers[2].setPosition(-22.06, 0, -8.631);

                    let idx = 0;
                    this.Desk.getComponent(Collider).enabled = true;
                    this.schedule(() => {
                        this.moveAnim(idx)
                        idx += 1;
                    }, 1, 1, 1)
                    return;
                }
                anim.crossFade(this.customersAnim[1].name, 0.1);
                tween(this.waitingCust[0])
                    .to(0.6, { position: this.customerPos[3] }, { easing: "linear" })
                    .call(() => {
                        this.Desk.getComponent(Collider).enabled = true;
                    })
                    .start()
            })
            .start();


    }


    counter() {

        if (this.waitingCust.length > 0) {
            this.audiosource.playOneShot(this.audio, 0.6);
            this.Desk.getComponent(Collider).enabled = false;
            this.Balance += 50;
            this.schedule(() => {
                let cashNode = instantiate(this.Cash);
                this.node.scene.addChild(cashNode);
                cashNode.setPosition(-21, 3, -13)
                tween(cashNode).to(0.3, { position: new Vec3(-11, 18, -20) }).call(() => {
                    cashNode.destroy();

                }).start();
            }, 0.1, 3)

            this.MoveoutAnim();
            this.Bal.string = "$" + this.Balance.toString();

        } else {
            if (this.Upgrades[2].parent.active) {
                CharacterMovement.id = 3;
            } else {
                CharacterMovement.id = 4;
            }

        }

    }

    OnStartButtonClick() {

        if (sys.os === sys.OS.ANDROID) {
            window.open("https://play.google.com/store/apps/details?id=co.gxgames.spa&hl=en", "Serinity Spa");
        } else if (sys.os === sys.OS.IOS) {
            window.open("https://apps.apple.com/us/app/serenitys-spa-beauty-salon/id6446709410", "Serinity Spa");
        } else {
            window.open("https://play.google.com/store/apps/details?id=co.gxgames.spa&hl=en", "Serinity Spa");
        }
       this.super_html_playable.download();

    }

    dt = 0;
    ldt = 0;

    update(deltaTime: number) {
        this.dt += deltaTime;

        if (this.dt > 37 || CollisionTrigger.Unlock >= 3) {
            this.ldt += deltaTime;
            if (this.ldt > 7) {
                this.canvas.children[2].active = false;
                this.canvas.children[1].active = true;
            }

        }

    }
}

