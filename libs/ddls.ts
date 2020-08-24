declare namespace DDLS {
    class World{
        constructor(w,h)
        // obj={ img:img, precision:2.8, color:{a:0} }
        addBitmapZone(obj:any);
        //{ x:555, y:555, r:2, speed:10 }
        addHeroe(obj:any);
        update()
        reset(w,h);
        rebuild(mesh:RectMesh)
        // obj={ img:img, precision:2.8, color:{a:0} }
        updateBitmapZone(obj:any);

        heroes:Array<Entity>;

        w:number;
        h:number;
        mesh:RectMesh;
    }

    class Entity{
        constructor(obj:any, w:World)
        isSee:boolean;
        isWalking:boolean;
        isMove:boolean;
        world:World;
        position:Point;

        path:Array<any>;

        setTarget( x, y )
        /**return x, y, r:angle */
        getPos():any;
        update();
    }

    class Point{
        constructor(x,y);
        x;
        y;
    }

    class Face {
        constructor()
        id:number;
        isReal:boolean; 
        edge:Edge;
    }

    class Edge
    {
        constructor()
        id:number;

        //fromConstraintSegments:Array<any>;
        isConstrained:boolean;
        isReal:boolean;
        originVertex:Vertex;
        oppositeEdge:Edge;
        nextLeftEdge:Edge;
        leftFace:Face;
    }

    class Vertex{
        constructor()
        id:number;
        pos:Point;
        edge:Edge;
    }

    class RectMesh{
        constructor(w,h)
        w:number;
        h:number;
        _vertices:Array<Vertex>;
        _edges:Array<Edge>;
        _faces:Array<Face>;
    }

}