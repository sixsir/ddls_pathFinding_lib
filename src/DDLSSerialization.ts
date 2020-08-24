
export class DDLSSerialization 
{

    public static Serialize(world:DDLS.World):Laya.Byte
    {
        let result = new Laya.Byte();

        result.writeInt16(world.w);
        result.writeInt16(world.h);
        this.SerializeMesh(world.mesh, result);

        return result;
    }

    private static SerializeMesh(mesh:DDLS.RectMesh, target:Laya.Byte)
    {

        target.writeUint32(mesh._vertices.length);
        target.writeUint32(mesh._edges.length);
        target.writeUint32(mesh._faces.length);


        for(let i=0; i<mesh._vertices.length; i++)
        {
            mesh._vertices[i].id = i;
        }
        for(let i=0; i<mesh._edges.length; i++)
        {
            mesh._edges[i].id = i;
        }
        for(let i=0; i<mesh._faces.length; i++)
        {
            mesh._faces[i].id = i;
        }


        for(let vertex of mesh._vertices)
        {
            this.SerializeVertex(vertex, target);
        }

        for(let edge of mesh._edges)
        {
            this.SerializeEdge(edge, target);
        }
        
        for(let face of mesh._faces)
        {
            this.SerializeFace(face, target);
        }
        
    }

    private static DeSerializeMesh(mesh:DDLS.RectMesh, target:Laya.Byte)
    {

        let numVertices = target.readUint32();
        let numEdges = target.readUint32();
        let numFaces = target.readUint32();

        mesh._vertices = new Array<DDLS.Vertex>(numVertices);
        for(let i=0; i<numVertices; i++)
            mesh._vertices[i] = new DDLS.Vertex();

        mesh._edges = new Array<DDLS.Edge>(numEdges);
        for(let i=0; i<numEdges; i++)
            mesh._edges[i] = new DDLS.Edge();

        mesh._faces = new Array<DDLS.Face>(numFaces);
        for(let i=0; i<numFaces; i++)
            mesh._faces[i] = new DDLS.Face();
        
        for(let i=0; i<numVertices; i++)
        {
            this.DeSerializeVertex(mesh._vertices[i], target, mesh._edges, i);
        }

        
        for(let i=0; i<numEdges; i++)
        {
            this.DeSerializeEdge(mesh._edges[i], mesh._edges, mesh._vertices, mesh._faces, target);
        }

        for(let i=0; i<numFaces; i++)
        {
            this.DeSerializeFace(mesh._faces[i], mesh._edges, target);
        }

    }

    private static SerializeFace(face:DDLS.Face, target:Laya.Byte)
    {
        target.writeUint32(face.edge.id | ((face.isReal ? 1 : 0)<<31));
    }

    private static DeSerializeFace(face:DDLS.Face, edges:Array<DDLS.Edge>, target:Laya.Byte)
    {
        let id = target.readUint32();
        face.isReal = ((id >> 31) & 1) == 1;
        face.edge = edges[id & 0xFFFFFFF];
    }

    private static SerializeEdge(edge:DDLS.Edge, target:Laya.Byte)
    {
        let mask = edge.isConstrained ? 1 : 0;
        mask |= edge.isReal ? 2 : 0;
        target.writeUint32(edge.originVertex.id | (mask<<24))

        let v1 = edge.oppositeEdge ? edge.oppositeEdge.id + 1 : 0;
        let v2 = edge.nextLeftEdge ? edge.nextLeftEdge.id + 1 : 0;
        let v3 = edge.leftFace ? edge.leftFace.id + 1 : 0;
        let c1 = (v1&0xFFFFF) | (v3&0xFFF)<<20;
        let c2 = (v2&0xFFFFF) | (v3&0xFFF000)<<8;

        target.writeUint32(c1);
        target.writeUint32(c2);
    }

    private static DeSerializeEdge(edge:DDLS.Edge, edges:Array<DDLS.Edge>, verticess:Array<DDLS.Vertex>, faces:Array<DDLS.Face>, target:Laya.Byte)
    {
        let id = target.readUint32();
        edge.isConstrained = ((id >> 24) & 1) == 1;
        edge.isReal = ((id >> 24) & 2) == 2;

        edge.originVertex = verticess[id & 0xFFFFFF];

        let c1 = target.readUint32();
        let c2 = target.readUint32();

        let v1 = c1 & 0xFFFFF;
        let v2 = c2 & 0xFFFFF;
        let v3 = ((c1>>20)&0xFFF) | ((c2>>8) & 0xFFF000);

        edge.oppositeEdge = v1!=0 ? edges[v1 - 1] : null;
        edge.nextLeftEdge = v2!=0 ? edges[v2 - 1] : null;
        edge.leftFace = v3!=0 ? faces[v3 - 1] : null;
    }

    private static SerializeVertex(vertex:DDLS.Vertex, target:Laya.Byte)
    {
        target.writeInt16(vertex.pos.x);
        target.writeInt16(vertex.pos.y);
        target.writeUint32(vertex.edge.id);
    }

    private static DeSerializeVertex(vertex:DDLS.Vertex, target:Laya.Byte, edges:Array<DDLS.Edge>, index:number)
    {
        vertex.pos.x = target.readInt16();
        vertex.pos.y = target.readInt16();
        vertex.edge = edges[target.readInt32()];
    }
    
    
    public static DeSerialize(bin:Laya.Byte) : DDLS.World
    {
        let time = Laya.Browser.now();
        let w = bin.readInt16();
        let h = bin.readInt16();
        let world = new DDLS.World(w, h);
        this.DeSerializeMesh(world.mesh, bin);
        console.log("反序列化耗时：", Laya.Browser.now() - time);
        return world;        
    }

}