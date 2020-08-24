import { BattleSceneDataManager } from "./BattleSceneDataManager";
import { PathFindingSerialization } from "../util/PathFindingSerialization";
import D3ResKey from "../enum/D3ResKey";
import GameDataManager from "./GameDataManager";

export class PathFindManager {

    private static world: DDLS.World;

    public static init() {

        let binData = Laya.loader.getRes(D3ResKey.DDLS_BIN);
        let bytes = new Laya.Byte(binData);
        this.world = PathFindingSerialization.DeSerialize(bytes);


        //this.world = new DDLS.World(2048, 2048);
        //this.world.addBitmapZone({ url: ResConfig.getResUrl("res/AStar.png"), precision: 1, color: { a: 0 } });



        this.world.addHeroe({ x: 555, y: 555, r: 1 });

        Laya.loader.clearRes(D3ResKey.DDLS_BIN, true);
    }

    private static inited:boolean = false;

    public static find(sx: number, sy: number, ex: number, ey: number) {
        GameDataManager.isRunPathFind = true;
        let min: number = BattleSceneDataManager.SCENE_MIN;
        let max: number = BattleSceneDataManager.SCENE_MAX;
        const count: number = 2048;

        /*
        //Serialize:
        if(!this.inited)
        {
            let bytes = PathFindingSerialization.Serialize(PathFindManager.world);
            let blob = new Blob([bytes.buffer], {type: "application/octet-binary"});
            saveAs(blob, "ddls.bin");

            bytes.pos = 0;
            let world = PathFindingSerialization.DeSerialize(bytes);
            world.addHeroe({ x: 555, y: 555, r: 1 });
            this.world = world;
            this.inited = true;
        }*/
        

        if (!BattleSceneDataManager.instance.isReachableWithCheckAround(ex, ey))
            return [];

        let startX = Math.round((sx - min) / (max - min) * count);
        let startZ = Math.round((sy - min) / (max - min) * count);

        let xIndex = Math.round((ex - min) / (max - min) * count);
        let zIndex = Math.round((ey - min) / (max - min) * count);

        PathFindManager.world.heroes[0].position.x = startX;
        PathFindManager.world.heroes[0].position.y = startZ;
        // let time = Laya.Browser.now();
        PathFindManager.world.heroes[0].setTarget(xIndex, zIndex);
        // if(Laya.Browser.now() - time > 500)
        // console.log("寻路耗时：", Laya.Browser.now() - time);
        var path: Array<any> = PathFindManager.world.heroes[0].path;

        // var path:Array<any> = this.astart1.findPath(startX, startZ, xIndex, zIndex, this.grid);
        let newPath: number[][] = [];
        for (let index = 0; index < path.length-1;) {
            let x = path[index];
            let y = path[index+1];
            let ary = [];
            ary.push(x);
            ary.push(y);
            newPath.push(ary);
            index += 2;
        }
        for(let point of newPath)
        {
            point[0] = point[0]*(max - min)/count + min + (max-min)/count/2;
            point[1] = point[1]*(max - min)/count + min + (max-min)/count/2;
        }
        //console.log(path);

        return newPath;
    }
}