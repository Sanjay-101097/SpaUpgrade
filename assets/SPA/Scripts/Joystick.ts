
    import { _decorator, Component, Vec2, Vec3, UITransform, Node, EventTouch, input, Input, EventMouse } from 'cc';
    const { ccclass, property } = _decorator;
    
    @ccclass('Joystick')
    export class Joystick extends Component {
        @property(Node)
        thumb: Node = null;
    
        @property(Node)
        target: Node = null; // The 3D object to move
    
        @property
        moveSpeed: number = 3;
    
        private radius: number = 0;
        private direction: Vec2 = new Vec2();
        private moving = false;
    
        onLoad() {
            this.radius = this.node.getComponent(UITransform).width / 2;
    
            this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    
        onTouchStart(event: EventTouch) {
            this.processTouch(event);
        }
    
        onTouchMove(event: EventTouch) {
            this.processTouch(event);
        }
    
        onTouchEnd(event: EventTouch) {
            this.thumb.setPosition(Vec3.ZERO);
            this.direction.set(0, 0);
            this.moving = false;
        }
    
        processTouch(event: EventTouch) {
            const touchPos = event.getUILocation();
            const local = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y));
            let dir = new Vec2(local.x, local.y);
    
            if (dir.length() > this.radius) {
                dir = dir.normalize().multiplyScalar(this.radius);
            }
    
            this.thumb.setPosition(new Vec3(dir.x, dir.y, 0));
            this.direction.set(dir.x / this.radius, dir.y / this.radius);
            this.moving = true;
        }
    
        update(dt: number) {
            if (this.moving && this.target) {
                // Move in X and Z direction based on joystick
                const moveVec = new Vec3(this.direction.x, 0, -this.direction.y);
                moveVec.normalize().multiplyScalar(this.moveSpeed * dt);
                this.target.setPosition(this.target.position.add(moveVec));
            }
        }
    }
    

