pragma solidity ^0.4.14;

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
        bid: bids[i],
        ask: asks[i],
        last: lasts[i],
        time: uint64(now)
      });
    }

    NewMarketInfo();
  }

  function close() onlyOwner {
    selfdestruct(owner);
  }

  // If you can look into the seeds of time,
  // And say which grain will grow and which will not,
  // Speak then to me
  // - Macbeth 1.3
}