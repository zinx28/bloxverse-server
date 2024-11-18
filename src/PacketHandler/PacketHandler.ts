import { ClientSocket } from "..";
import zlib from "zlib";
import parsePacket from "./ParsePacket";


export default async function PacketHandler(
  data: Buffer,
  client: ClientSocket
) {
    const packetType = data.readUInt8(0);
    const payloadSize = data.readUInt32LE(1);
    const compressedPayload = data.slice(5, 5 + payloadSize);

    zlib.gunzip(compressedPayload, (err, decompressedData) => {
      if (err) {
        console.error("Error decompressing payload:", err);
        return;
      }

      try {
        parsePacket(packetType, decompressedData, client)
      } catch (err) {
        console.error("Error decoding decompressed data:", err);
      }
    });

}
