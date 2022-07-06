// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @notice This SC is similar to 'SimpleCollectible'
/// @dev Here, it has been tried to match with the new constraint of `tokenURI` & `_baseURI`
contract SimpleCollectibleCompatible is ERC721, Ownable, Pausable {
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

    /// @notice The IPFS base domain url
    // function _baseURI() internal pure override returns (string memory) {
    //     return "https://gateway.pinata.cloud/ipfs/";
    // }

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

    /// @notice The replacement function for `getTokenURI` as per ERC721 standard file.
    /// @dev But, it outputs the uri for a token id like this: https://gateway.pinata.cloud/ipfs/1
    ///     And this is not the actual one which contains the IPFS hash. So, better use "SimpleCollectible" as your ERC721 contract
    // function tokenURI(uint256 tokenId)
    //     public
    //     view
    //     override
    //     returns (string memory)
    // {
    //     _requireMinted(tokenId);

    //     string memory baseURI = _baseURI();
    //     return
    //         bytes(baseURI).length > 0
    //             ? string(abi.encodePacked(baseURI, tokenId))
    //             : "";
    // }

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
