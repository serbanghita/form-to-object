import fs from "fs";
import path from "path";

export function readFixture(relativePath: string) {
  return fs.readFileSync(path.resolve(__dirname, "fixtures/", relativePath), { encoding: 'utf8', flag: 'r' })
}
