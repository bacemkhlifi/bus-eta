import fs from "node:fs/promises";
import path from "node:path";

const corridorsCsv = await fs.readFile("public/data/corridors.csv", "utf8");
const [, ...rows] = corridorsCsv.trim().split(/\r?\n/);

const output = [
  "corridor_id,direction,km_marker,arrival_offset_minutes",
  ...rows.flatMap((row) => {
    const columns = row.split(",");
    const corridorId = columns[0];
    const maxKm = Number(columns[9]);
    const minutesPerKm = Number(columns[10]);
    const centerExitMinutes = Number(columns[11]);
    const points = [];

    for (let km = 0; km <= maxKm; km += 0.5) {
      const outbound = Math.round(centerExitMinutes + km * minutesPerKm);
      const inbound = Math.round(centerExitMinutes + (maxKm - km) * minutesPerKm);
      points.push(`${corridorId},outbound,${km.toFixed(1)},${outbound}`);
      points.push(`${corridorId},inbound,${km.toFixed(1)},${inbound}`);
    }

    return points;
  }),
].join("\n");

const outputPath = path.resolve("public/data/km-points.csv");
await fs.writeFile(outputPath, `${output}\n`, "utf8");
console.log(outputPath);
