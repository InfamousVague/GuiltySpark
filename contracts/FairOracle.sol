pragma solidity ^0.4.14;

contract FairOracle {
  address public owner = msg.sender;

  struct Asset {
    uint64 bid;
    uint64 ask;
    uint64 last;
  }

  mapping (bytes32 => Asset) ticker;

  event NewMarketInfo();

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function updateMarket(bytes32[] assets, uint64[] bids, uint64[] asks, uint64[] lasts) onlyOwner {
    for (uint i = 0; i < assets.length; i++) {
      ticker[assets[i]] = Asset({
        bid: bids[i],
        ask: asks[i],
        last: lasts[i]
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