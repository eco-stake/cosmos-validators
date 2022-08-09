export default function Chain(data){
  const assets = data.assets
  const baseAsset = assets && assets[0]
  return {
    ...data,
    baseAsset
  }
}