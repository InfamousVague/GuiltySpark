pragma solidity ^0.4.11;

contract FairOracle {
  address public owner;

  function FairOracle() {
    owner = msg.sender;
  }

  uint constant floatPrecision = 1000000;

  struct Asset {
    uint bid;
    uint ask;
    uint last;
    uint64 time;
  }

  mapping (bytes8 => Asset) ticker;

  event NewMarketInfo();

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function updateMarket(bytes8[] assets, uint[] bids, uint[] asks, uint[] lasts) onlyOwner {
    for (uint i = 0; i < assets.length; i++) {
      ticker[assets[i]] = Asset({
        bid: bids[i] / floatPrecision,
        ask: asks[i] / floatPrecision,
        last: lasts[i] / floatPrecision,
        time: uint64(now)
      });
    }

    NewMarketInfo();
  }

  function getAsset(bytes8 asset) returns (uint, uint, uint, uint) { // bid, ask, last, time
    Asset memory selectedAsset = ticker[asset];
    return (selectedAsset.bid, selectedAsset.ask, selectedAsset.last, selectedAsset.time);
  }

  function getAssets(bytes8[] assets) returns (bytes8[], uint[], uint[], uint[], uint) { // assets, bids, asks, lasts, time
    uint[] memory bids;
    uint[] memory asks;
    uint[] memory lasts;
    uint time;

    for (uint i = 0; i < assets.length; i++) {
      bids[i]  = ticker[assets[i]].bid;
      asks[i]  = ticker[assets[i]].ask;
      lasts[i] = ticker[assets[i]].last;
      // All assets are updated at the same time currently so an array is un-nessisary
      time = ticker[assets[i]].time;
    }

    return (assets, bids, asks, lasts, time);
  }

  function close() onlyOwner {
    selfdestruct(owner);
  }

  // If you can look into the seeds of time,
  // And say which grain will grow and which will not,
  // Speak then to me
  // - Macbeth 1.3
}