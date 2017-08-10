pragma solidity ^0.4.11;

contract GuiltySparkLite {
  address public owner;

  function GuiltySparkLite() {
    owner = msg.sender;
  }

  // If you're using this Oracle, please note to represent floats
  // We multiply by floatPrecision then divide later when storing
  uint constant floatPrecision = 1000000;

  struct Asset {
    uint16 last;
    uint64 time;
  }

  mapping (bytes8 => Asset) ticker;

  event NewMarketInfo();

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  // Update the market price stored on chain
  function updateMarket(bytes8[] assets, uint16[] lasts) onlyOwner {
    for (uint i = 0; i < assets.length; i++) {
      ticker[assets[i]] = Asset({
        last: uint16(lasts[i] / floatPrecision),
        time: uint64(now)
      });
    }

    NewMarketInfo();
  }

  // Get a single asset
  function getAsset(bytes8 asset) constant returns (uint16, uint64) { //  last, time
    Asset memory selectedAsset = ticker[asset];
    return (selectedAsset.last, selectedAsset.time);
  }

  // Get a list of assets
  function getAssets(bytes8[] assets) constant returns (bytes8[], uint16[], uint64[]) { // asset, lasts, times
    uint16[] memory lasts;
    uint64[] memory times;

    for (uint i = 0; i < assets.length; i++) {
      lasts[i] = uint16(ticker[assets[i]].last);
      times[i] = uint64(ticker[assets[i]].time);
    }

    return (assets, lasts, times);
  }

  // Close the contract
  function close() onlyOwner {
    selfdestruct(owner);
  }

  // If you can look into the seeds of time,
  // And say which grain will grow and which will not,
  // Speak then to me
  // - Macbeth 1.3
}