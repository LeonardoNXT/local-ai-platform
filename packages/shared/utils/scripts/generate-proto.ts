import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { extname, join, resolve, relative } from "node:path";

const root = resolve(__dirname, "../../../..");
const protoRoot = resolve(root, "packages/contracts/protobuf");
const outRoot = resolve(root, "packages/shared/grpc/generated");
const grpcPackageRoot = resolve(root, "packages/shared/grpc");

function walk(dir: string, extension: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath, extension);
    }

    if (entry.isFile() && extname(entry.name) === extension) {
      return [fullPath];
    }

    return [];
  });
}

if (!existsSync(outRoot)) {
  mkdirSync(outRoot, { recursive: true });
}

console.log("Generating protobuf...");

const protos = walk(protoRoot, ".proto");

if (protos.length === 0) {
  throw new Error(`No .proto files found in ${protoRoot}`);
}

const binName =
  process.platform === "win32"
    ? "protoc-gen-ts_proto.cmd"
    : "protoc-gen-ts_proto";

const plugin = resolve(root, "node_modules/.bin", binName);

execFileSync(
  "npx",
  [
    "protoc",
    `--plugin=protoc-gen-ts_proto=${plugin}`,
    `--ts_proto_out=${outRoot}`,
    "--ts_proto_opt=outputServices=grpc-js,esModuleInterop=true",
    `--proto_path=${protoRoot}`,
    ...protos,
  ],
  {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

console.log("Done.");
console.log("Fixing protobuf imports and generating index.ts...");

const generatedFiles = walk(outRoot, ".ts");

for (const file of generatedFiles) {
  const content = readFileSync(file, "utf8");
  const fixedContent = content.replaceAll(
    "@bufbuild/protobuf/wire",
    "@bufbuild/protobuf",
  );
  writeFileSync(file, fixedContent);
}

const indexExports = generatedFiles
  .map((file) => {
    const relativePath = relative(grpcPackageRoot, file)
      .replace(/\\/g, "/")
      .replace(/\.ts$/, "");

    const fileName = relativePath.split("/").pop() || "";
    const namespaceName = fileName
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    return `export * as ${namespaceName} from "./${relativePath}";`;
  })
  .join("\n");

const indexContent = `import "reflect-metadata";\n\n${indexExports}\n`;

writeFileSync(join(grpcPackageRoot, "index.ts"), indexContent);

console.log("Done. index.ts updated safely with Namespaces!");
