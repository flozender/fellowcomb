import React, { useState } from "react";
import { Link as ReactLink } from "react-router-dom";
import { SEARCH } from "../gql/search";
import { useLazyQuery } from "@apollo/react-hooks";

import {
  Flex,
  Heading,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Avatar,
  useToast,
} from "@chakra-ui/react";

import Honeycomb from "../assets/Honeycomb.png";

import { useSetUser } from "../contexts/usercontext";

// const dummyResult = [
//   { id: "jcs98", name: "Jainam Shah", pfp: "", color: "tomato" },
//   { id: "flozender", name: "Tayeeb Flozender", pfp: "", color: "teal.500" },
//   { id: "utkarsh867", name: "Utkarsh Goel", pfp: "", color: "orange.600" },
// ];

const SearchResultItem = ({ user, onClose, setSearch, setSearchResult }) => {
  const { username, name, color } = user;
  return (
    <>
      <Divider />
      <ReactLink
        to={`/users/${username}`}
        onClick={() => {
          onClose();
          setSearch("");
        }}
      >
        <Flex direction="row" align="center" p="4">
          <Avatar mr="4" background={color} />
          <Text fontSize="lg" color="black">
            {name}
          </Text>
          <Text fontSize="sm" color="gray.500" ml="2">
            ({username})
          </Text>
        </Flex>
      </ReactLink>
    </>
  );
};

const Header = (props) => {
  const [
    makeSearchQuery,
    { loading: searchLoading, error: searchError, data: searchData },
  ] = useLazyQuery(SEARCH);

  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setUser = useSetUser();
  const toast = useToast();

  const signOut = () => {
    // TODO: make api call to delete user-session
    setUser(() => null);
    window.localStorage.removeItem("userId");
  };

  const sendSearch = (event) => {
    if (!search) {
      toast({
        title: "Please enter a search query",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // TODO make the search request
    makeSearchQuery({ variables: { search } });
    // set result and open modal on success
    console.log(searchData);
    onOpen();
  };

  const handleChange = (event) => setSearch(event.target.value);

  if (searchLoading) {
    return <></>;
  } else if (searchError) {
    console.log(searchError);
    return <></>;
  }

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        {...props}
      >
        <Flex align="center">
          <ReactLink to="/">
            <Image src={Honeycomb} w={8} mx={2} />
          </ReactLink>
          <Heading as={ReactLink} to="/" size="xl" fontFamily="KoHo">
            fellowcomb
          </Heading>
        </Flex>

        <Flex align="center" justifyContent="space-between">
          {!props.isLoggedIn ? (
            <>
              {/* Search Bar */}
              <InputGroup display={["none", "none", "block"]} size="md">
                <Input
                  type="text"
                  placeholder="Find People..."
                  onChange={handleChange}
                  value={search}
                  focusBorderColor="yellow.500"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="md"
                    onClick={sendSearch}
                    colorScheme="yellow"
                    variant="outline"
                    border="0px"
                  >
                    <span role="img" aria-label="search">
                      🔍
                    </span>
                  </Button>
                </InputRightElement>
              </InputGroup>

              {/* <Button
                as={ReactLink}
                to="/graph-view"
                variant="ghost"
                border="0px"
                onClick={() => signOut()}
                colorScheme="yellow"
              >
                Explore
              </Button> */}

              <Button
                variant="ghost"
                mx={[2, 2, 4]}
                p={4}
                onClick={() => signOut()}
                colorScheme="yellow"
              >
                Sign Out
              </Button>
            </>
          ) : (
            ""
          )}
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search results for "{search}"</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {searchData &&
              searchData.search.map((user, id) => (
                <SearchResultItem
                  key={id}
                  user={user}
                  onClose={onClose}
                  setSearch={setSearch}
                />
              ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Header;
