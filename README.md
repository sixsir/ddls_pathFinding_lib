# ddls_pathFinding_lib
基于DDLS寻路库的优化版

主要是把寻路的二进制数据序列号和反序列化，以增加初始化寻路数据的体验，这样可以很快速的完成数据初始化

### 使用方法：

- 序列化操作代码：

```typescript
this.world = new DDLS.World(2048, 2048);
this.world.addBitmapZone({ url: "res/AStar.png", precision: 1, color: { a: 0 } });

let bytes = PathFindingSerialization.Serialize(PathFindManager.world);
let blob = new Blob([bytes.buffer], {type: "application/octet-binary"});
saveAs(blob, "ddls.bin");
```

- 反序列化操作代码：

  ```typescript
  let binData = Laya.loader.getRes(D3ResKey.DDLS_BIN);
  let bytes = new Laya.Byte(binData);
  this.world = DDLSSerialization.DeSerialize(bytes);
  
  //this.world.addHeroe({ x: 555, y: 555, r: 1 });
  ```

  