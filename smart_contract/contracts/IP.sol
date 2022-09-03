// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract IP {
    address public owner;

    struct Count{
       uint count;
    }
    
    mapping (uint => Count) newcount;
    
    enum Status {
        Pending,
        Accepted,
        Rejected
    }

    struct IParameter {
       // uint id;
        address user;
        string IPname;
        string fullname;
        string country;
        string addressplace;    
        string symbol;   
        uint256 timestamp;        
        Status[] status; 
        bool isRegistered;
    }

    uint public ipCount;  

    struct bid {
        address bidder;
        uint256 value;
        mapping (address => IParameter) ipara;
    }

    mapping (uint => IParameter) public property;
    
    mapping (uint => bid) bidip;
    //mapping(address => mapping (address => bid)) public allowance;
    
 
    constructor() {
        owner = msg.sender;
        ipCount = 0;
        setIP(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, "egg1", "stol1", "eth1", "leb", "sym");
        setIP(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db, "egg2", "stol2", "eth2", "leb", "sym"); 
        setIP(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB, "egg3", "stol3", "eth3", "leb", "sym");

        // states[Status.Pending] = "ForSale";
        // states[Status.Accepted] = "SellerDelisted";
        // states[Status.Rejected] = "BuyerCancelled";
    }

    address[] public intelProperty;
        
    address[] public bidProperty;
  
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    // function addIp(address _address, string memory _IPname, string memory _fullname, string memory _country, string memory _addressplace, string memory _symbol,Status a) public {
    //     property[ipCount] = IParameter(
    //          ipCount,
    //         _address,
    //         _IPname,
    //         _fullname, 
    //         _country, 
    //         _addressplace, 
    //         _symbol,
    //         block.timestamp,
    //         true,
    //         a);
    //     ipCount++;
    // }
    function setIP(address _address, string memory _IPname, string memory _fullname, string memory _country, string memory _addressplace, string memory _symbol) public {
        Status a = Status.Pending;
        property[ipCount].user = _address;
        property[ipCount].IPname = _IPname;
        property[ipCount].fullname = _fullname;
        property[ipCount].country = _country;
        property[ipCount].addressplace = _addressplace;
        property[ipCount].symbol = _symbol;
        property[ipCount].timestamp = block.timestamp;
        property[ipCount].status.push(a);
        newcount[ipCount].count = 0;
        property[ipCount].isRegistered = true;
        // property[ipCount].status.push(a);
        // property[ipCount] = IParameter(
        //     //  ipCount,
        //      _address,
        //      _IPname,
        //      _fullname,
        //      _country,
        //      _addressplace,
        //      _symbol,
        //      block.timestamp,
        //      true
        // );
        ipCount++;
        
       // intelProperty.push(_address);
    }

    // function get(uint _memberId) public view returns(IParameter memory) {
    //     return property[_memberId];
    // }

    function getMember() public view returns ( address[] memory, string[] memory, string[] memory, string[] memory, string[] memory, string[] memory, uint256[] memory, Status[] memory){    
        //uint[] memory id = new uint[](ipCount);
        address[] memory user = new address[](ipCount);
        string[] memory IPname = new string[](ipCount);
        string[] memory fullname = new string[](ipCount);
        string[] memory country = new string[](ipCount);
        string[] memory addressplace = new string[](ipCount);
        string[] memory symbol = new string[](ipCount);
        uint256[] memory timestamp = new uint256[](ipCount);
        Status[] memory status = new Status[](ipCount);
         
        for (uint i = 0; i < ipCount; i++) {
            uint num = newcount[i].count;
            IParameter storage parameter = property[i];
            //id[i] = parameter.id;
            user[i] = parameter.user;
            IPname[i] = parameter.IPname;
            fullname[i] = parameter.fullname;
            country[i] = parameter.country;
            addressplace[i] = parameter.addressplace;
            symbol[i] = parameter.symbol;
            timestamp[i] = parameter.timestamp;
            status[i] = parameter.status[num];
        }
        return (user, IPname, fullname, country, addressplace, symbol, timestamp, status);
    }
   
    function changeStatus(uint i, Status val) public onlyOwner returns(bool) {
        property[i].status.push(val);
        newcount[i].count++; 
        return true;
    }
    
    function getStatus(uint i) public view returns(Status status) {
        //console.log(property[_address].status[newcount[_address].count]);
        return property[i].status[newcount[i].count];
    }
    
    function getAllIP() view public returns (address[] memory) {
        return intelProperty;
    }

    function getIP(uint i) public view returns (string memory, string memory, string memory, string memory, string memory, uint256, Status status) {
        uint num = newcount[i].count;
        IParameter memory u = property[i];
        return (
            u.IPname, 
            u.fullname,
            u.country,
            u.addressplace, 
            u.symbol,
            u.timestamp, 
            u.status[num]
            );
    }

    function countIP() view public returns (uint) {
        return intelProperty.length;
    }

    // function block_call() public view returns (uint256){
    //     return block.number; 
    // }

    // function Time() public view returns (uint256){
    //     return block.timestamp; 
    // }

    // function bidder(address _address, address _bidderaddress, uint256 _value) public {
    //    // require(property[_address].isRegistered, "Not registered address");
    //     bidip[_address].bidder = _bidderaddress;
    //     bidip[_address].value = _value;
    //     bidProperty.push(_address);
    // }
    
    // function bidder(uint _id, address _bidderaddress, uint256 _value) public {
    //     require(property[_id].isRegistered, "Not registered address");
    //     bidip[_id] = bid(
    //     _bidderaddress,
    //      _value
    //     );
    //     //bidProperty.push(_id);
    // }


    // function viewBid(address _address) public view {
    //    console.log(property[_address].IPname);
    //     //  if(property[_address].status[newcount[_address].count]){
    //     //      console.log('correct');
    //     //  } else {
    //     //      console.log('incorrect');
    //     //  }
    // }
    function getAllbids() view public returns (address[] memory) {
        return bidProperty;
    }

    // function viewBid(address _address) public view returns (address, uint256) {
    // return (
    //     bidip[_address].bidder, 
    //     bidip[_address].value
    //     );
    // }
}