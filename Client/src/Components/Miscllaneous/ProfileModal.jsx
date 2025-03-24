import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Determine the image source
  // console.log(user);
 
 let imgsrc = user.pic;
if (imgsrc.includes('public')) {
  imgsrc = `api/${imgsrc.replace(/\\/g, "/").replace("public", "")}`;
}
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          h="350px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          p="20px"
        >
          <ModalHeader
            fontSize="36px"
            fontFamily="Work sans"
            textAlign="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="8px"
          >
            <Image
              borderRadius="full"
              boxSize="100px"
              src={imgsrc}
              alt={user.name}
            />
            <Text fontSize="16px" fontFamily="Work sans" textAlign="center">
              <strong>Email:</strong> {user.email}
            </Text>
          </ModalBody>
          <ModalFooter width="100%" justifyContent="flex-end">
            <Button onClick={onClose} size="sm">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
