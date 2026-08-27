import fs from "node:fs/promises";
import path from "node:path";

const corridorsCsv = await fs.readFile("public/data/corridors.csv", "utf8");
const [, ...rows] = corridorsCsv.trim().split(/\r?\n/);

const output = [
  "corridor_id,km_marker,arrival_offset_minutes",
  ...rows.flatMap((row) => {
    const columns = row.split(",");
    const corridorId = columns[0];
    const maxKm = Number(columns[7]);
    const minutesPerKm = Number(columns[8]);
    const centerExitMinutes = Number(columns[9]);
    const points = [];

    for (let km = 0; km <= maxKm; km += 0.5) {
      points.push(`${corridorId},${km.toFixed(1)},${Math.round(centerExitMinutes + km * minutesPerKm)}`);
    }

    return points;
  }),
].join("\n");

const outputPath = path.resolve("public/data/km-points.csv");
await fs.writeFile(outputPath, `${output}\n`, "utf8");
console.log(outputPath);
