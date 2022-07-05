// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SimpleCollectible is ERC721, Ownable, Pausable {
    uint256 private _tokenCounter;

    mapping(uint256 => string) private _tokenURIs;

    event CollectibleMinted(address to, uint256 tokenId);

    constructor() ERC721("Doggie", "Dog") {
        _tokenCounter = 0;
    }

    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) private {
        !_exists(_tokenId);
        require(bytes(_tokenURI).length > 0, "Empty token URI");

        _tokenURIs[_tokenId] = _tokenURI;
    }

    function createCollectible(string memory _tokenURI)
        external
        whenNotPaused
        returns (uint256)
    {
        uint256 _newTokenId = _tokenCounter;
        _safeMint(msg.sender, _newTokenId);
        _setTokenURI(_newTokenId, _tokenURI);
        ++_tokenCounter;

        emit CollectibleMinted(msg.sender, _newTokenId);

        return _newTokenId;
    }

    function getNextTokenId() external view returns (uint256) {
        return _tokenCounter;
    }

    function getTokenURI(uint256 _tokenId)
        external
        view
        returns (string memory)
    {
        _requireMinted(_tokenId);
        return _tokenURIs[_tokenId];
    }

    // ------------------------------------------------------------------------------------------
    /// @notice Pause contract
    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    /// @notice Unpause contract
    function unpause() public onlyOwner whenPaused {
        _unpause();
    }
}
