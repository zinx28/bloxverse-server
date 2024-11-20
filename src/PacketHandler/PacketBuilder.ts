import { ClientSocket, GameInstance } from "..";

export default class PacketBuilder {
  private parts: Buffer[] = [];

  constructor(private packetId: number) {
    this.write("uint8", packetId);
  }

  write(type: string, value: any): this {
    switch (type.toLowerCase()) {
      case "string":
        var ValueString = value.toString()
        console.log("Sending string:", ValueString);
        const stringBuffer = Buffer.from(ValueString, "utf-8");
        console.log("String Buffer:", stringBuffer);
        console.log("String Length:", stringBuffer.length);
        this.write("uint16", stringBuffer.length);
        this.parts.push(stringBuffer);
        break;
      case "bool":
        this.write("uint8", (value as boolean) ? 1 : 0);
        break;
      case "float":
        const FloatBuffer = Buffer.alloc(4);
        FloatBuffer.writeFloatBE(value as number);
        this.parts.push(FloatBuffer);
        break;
      case "int":
        const IntBuffer = Buffer.alloc(4);
        IntBuffer.writeInt32BE(value as number);
        this.parts.push(IntBuffer);
        break;
      case "uint8":
        const UInt8buffer = Buffer.alloc(1);
        UInt8buffer.writeUInt8(value as number);
        this.parts.push(UInt8buffer);
        break;
      case "uint16":
        const UInt16buffer = Buffer.alloc(2);
        UInt16buffer.writeUInt16BE(value as number);
        this.parts.push(UInt16buffer);
        break;
      // makes life easier
      case "vector3":
        this.write("float", value.x);
        this.write("float", value.y);
        this.write("float", value.z);
        break;
      case "quaternion":
        this.write("float", value.x);
        this.write("float", value.y);
        this.write("float", value.z);
        this.write("float", value.w);
        break;
      case "color":
        this.write("float", value.r);
        this.write("float", value.g);
        this.write("float", value.b);
        this.write("float", value.a);
        break;
    }
    return this;
  }

  build(): Buffer {
    var Packet = Buffer.concat(this.parts);
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(Packet.length, 0);
    return Buffer.concat([lengthBuffer, Packet]);
  }

  sendToClient(client: ClientSocket) {
    if (!client.destroyed && !client.closed) {
      console.log("sending packet to user");
      client.write(this.build());
    }
  }

  sendToAllClientsExcept(clients: Array<ClientSocket>) {
    var built = this.build();
    GameInstance.players.forEach((player) => {
      if (
        !clients.includes(player.socket) &&
        !player.socket.destroyed &&
        !player.socket.closed
      ) {
        //console.log(`Sending Packet To ${player.displayName}`);
        player.socket.write(built);
      }
    });
  }

  sendToAllClients() {
    var built = this.build();
    GameInstance.players.forEach((player) => {
      if (!player.socket.destroyed && !player.socket.closed) {
       // console.log(`Sending Packet To ${player.displayName}`);
        player.socket.write(built);
      }
    });
  }
}
