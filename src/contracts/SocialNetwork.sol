pragma solidity ^0.5.0;

contract SocialNetwork {
  string public name;

  // auto incrementer
  uint public postCount = 0;

  mapping(uint => Post) public posts;

  struct Post {
    uint id;
    string content;
    uint tipAmount;
    address payable author;
  }

  event PostCreated(
    uint id,
    string content,
    uint tipAmount,
    address payable author
  );

  event PostTipped(
    uint id,
    string content,
    uint tipAmount,
    address payable author
  );

  constructor() public {
    name = 'Alfonz Social Network';
  }

  function createPost(string memory _content) public {
    // Validate content
    require(bytes(_content).length > 0);

    // auto increment primary key of posts
    postCount++;

    // Create the post
    // msg.sender = address of who is calling the function
    posts[postCount] = Post(postCount, _content, 0, msg.sender);

    // Trigger event
    emit PostCreated(postCount, _content, 0, msg.sender);
  }

  function tipPost(uint _postId) public payable {
    require(_postId > 0 && _postId <= postCount);

    // fetch the post
    Post memory _post = posts[_postId];

    // fetch author
    address payable _author = _post.author;

    // pay the author
    address(_author).transfer(msg.value);

    // increment tip amount of post
    // msg.value = value of ETH currency passed
    _post.tipAmount = _post.tipAmount + msg.value;

    // update the post
    posts[_postId] = _post;

    // trigger event
    emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
  }
}