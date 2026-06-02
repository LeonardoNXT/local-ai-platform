$root = Resolve-Path "../../../"
$protoRoot = "$root/packages/contracts/protobuf"
$outRoot = "$root/packages/shared/grpc/generated"
$plugin = "$root/node_modules/.bin/protoc-gen-ts_proto.cmd"

Write-Host "Generating protobuf..."

$protos = Get-ChildItem $protoRoot -Recurse -Filter *.proto | ForEach-Object {
    $_.FullName
}

npx protoc `
  --plugin=protoc-gen-ts_proto="$plugin" `
  --ts_proto_out="$outRoot" `
  --ts_proto_opt=outputServices=grpc-js,esModuleInterop=true `
  --proto_path="$protoRoot" `
  $protos

Write-Host "Done."

Write-Host "Fixing protobuf imports..."

Get-ChildItem "$outRoot" -Recurse -Filter *.ts | ForEach-Object {
    (Get-Content $_.FullName) `
        -replace '@bufbuild/protobuf/wire', '@bufbuild/protobuf' |
        Set-Content $_.FullName
}

Write-Host "Done."