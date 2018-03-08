pragma solidity ^0.4.0;


contract Ballot {
    
    // Ballot owner
    address gblChairman;

    // Voter class
    struct Voter {
        bool hasVoted;
        string adharNumber;
        bool isPresent;
    }
    
    // Participating party in the ballot
    struct Party {
        uint voteCount;
        bytes32 name;
    }
    
    // Parties list
    uint[] gblpartyListArr;
    mapping(uint => Party) gblpartyList;
    
    // Voter list
    mapping(address => Voter) gbl_voterList;
    
    // All global variables
    string gblballotName;
    uint gblvotingStartTime; //epoch format
    uint gblvotingEndTime; //epoch format
 
    // Modifier is owner
    modifier isOwner(){
        if(gblChairman == msg.sender)
        _;
    }
    
    // Modifer for expiry of this ballot
    modifier isNotExpired(){
        if(now >= gblvotingStartTime && now <= gblvotingEndTime)
        _;
        
    }
    
    
    /*** 
     * Function Name : Ballot() 
     * Function Use : Constructor to initialize gbl variables
     * Parameters:
     *  1. _ballotName : Name of election. e.g General Elections, State assembly, Local body elections etc.
     *  2. _votingEndTime : Time at which this voting will end (in seconds)
     */
    function Ballot(string _ballotName, 
                    uint _votingEndTime,
                    bytes32[] _partyNames) public {
                        
        gblChairman = msg.sender;
        gblballotName = _ballotName;
        gblvotingEndTime = _votingEndTime;
        gblvotingStartTime = now;
        for(uint i=0; i < _partyNames.length; i++){
            gblpartyList[i].name = _partyNames[i];
            gblpartyList[i].voteCount = 0;
            gblpartyListArr.push(i);
        }
    }
    
    /*** 
     * Function Name : AddParty() 
     * Function Use : Admin will create a party
     * Parameters :
     *  1. _partyId : Id of a party, can be integer only
     *  2. _partyName : Party Name in string
     * Returns : True or False
     */
    function addParty(bytes32 _partyName) public isOwner isNotExpired{

      uint partyid = gblpartyListArr.length +1;
        gblpartyList[partyid].name = _partyName;
        gblpartyList[partyid].voteCount = 0;
        gblpartyListArr.push(partyid);
    }
    
     
    
    /*** 
     * Function Name : AddVoter() 
     * Function Use : Add a voter to the list.
     * Parameters:
     *  1. _adharNumber : Adhar number of a voter
     * Returns : True or False
     */
    function addVoter(string _adharNumber, address voterAddr) public isOwner isNotExpired{
        gbl_voterList[voterAddr].hasVoted = false;
        gbl_voterList[voterAddr].adharNumber = _adharNumber;
        gbl_voterList[voterAddr].isPresent = true;
        //return true;
    }
    
    
    /*** 
     * Function Name : ValidateBallotVoter() 
     * Function Use : Check if a voter is avaliable in the list and hasVoted is false
     * Parameters:
     *  1. _adharNumber : Adhar number of a voter
     * Returns : True or False
     */
    function validateBallotVoter(address voterAddr) public  constant isOwner isNotExpired returns(bool){    
        if (gbl_voterList[voterAddr].isPresent == true && gbl_voterList[voterAddr].hasVoted == false) {        
            return true;
        }else {
            return false;
        }
        
    }
    
    /*** 
     * Function Name : GetListOfParties() 
     * Function Use : Get list of party names
     * Parameters:
     * Returns : Array of partyNames
     */  
    function getListOfParties() public constant returns(bytes32[]) {
        bytes32[] memory partyNamesArr =  new bytes32[](gblpartyListArr.length);
        for(uint i = 0; i < gblpartyListArr.length; i++){
            partyNamesArr[i] = gblpartyList[gblpartyListArr[i]].name;
        }
        return partyNamesArr;
    }
    
    /*** 
     * Function Name : DoVoting() 
     * Function Use : Actual method to do voting
     * Parameters:
     *  1. _partyId : Id of the party to which vote will be caste to
     * Returns : True or False
     */
    function doVoting(uint _partyId) public isNotExpired  returns(bool){
        //check if voter is present in the  list
        address voterAddr =  msg.sender;
        bool hasVoted = false;
        if (gbl_voterList[voterAddr].isPresent == true && gbl_voterList[voterAddr].hasVoted == false){
            uint voteCnt = 0;
            voteCnt = gblpartyList[_partyId].voteCount;
            gblpartyList[_partyId].voteCount = voteCnt + 1;
            hasVoted = true;
        }
        return hasVoted;
    }
    
    /*** 
     * Function Name : GetTotalVoteCountOfParty() 
     * Function Use : Get the total vote count
     * Parameters:
     *  1. _partyId : Id of the party for which total count is needed
     * Returns : total count of vote till now.
     */
    function getTotalVoteCountOfParty(uint _partyId) public constant returns(uint){
        uint totalVoteCnt =0;
        totalVoteCnt = gblpartyList[_partyId].voteCount;
        return totalVoteCnt;
    }
}
