
import { _decorator, Component, ProgressBar, Label, director, Node, SceneAsset, debug, sys, game, Game, macro } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('loadingScript')
export class loadingScript extends Component {

    @property({ type: Node })
    loadingNode: Node = null!;

    @property({ type: Node })
    progressBar: Node = null!;

    sceneName: string = "Spa";
    finalPercent: number = 0;

    onLoad(){

    }
    start() {

        // a progress of scene loading,0 ~ 1;
        director.preloadScene("Spa", (completedCount: number, totalCount: number, item: any) => {
            var percent = 0;
            if (totalCount > 0) {
                percent = 100 * completedCount / totalCount;
            }

            var pct = Math.max(percent, this.finalPercent)
            if (percent > this.finalPercent) {
                this.finalPercent = percent;
            }
            this.progressBar.getComponent(ProgressBar).progress = pct / 100;
            //   //console.log('progress', pct, pct/100);
            this.loadingNode.getComponent(Label).string ="Loading "+ Math.round(pct) + '%';
        }, (error: Error, asset: SceneAsset) => {
            //console.log('Scene Loaded');
            director.loadScene(this.sceneName);
        });

    }

}