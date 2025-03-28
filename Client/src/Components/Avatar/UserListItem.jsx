import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/react";





const UserListItem = ({ user, handleFunction }) => {


 
 let imgsrc = user.pic;
if (imgsrc.includes('public')) {
  imgsrc = `api/${imgsrc.replace(/\\/g, "/").replace("public", "")}`;
}


  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        bg: "#38B2AC", 
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={3}
        boxSize="30px"
        name={user.name}
        src={imgsrc}
      />
      <Box>
        <Text fontWeight="bold">{user.name}</Text>
        <Text fontSize="sm">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
