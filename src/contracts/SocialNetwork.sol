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
    address author;
  }

  event PostCreated(
    uint id,
    string content,
    uint tipAmount,
    address author
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
}