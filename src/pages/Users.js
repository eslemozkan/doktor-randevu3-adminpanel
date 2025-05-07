import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Text,
  Flex,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const Users = () => {
  const [users, setUsers] = useState([]);
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.800');
  const headerBg = '#394C8C';
  const headerColor = 'white';

  useEffect(() => {
    // TODO: Implement API call to fetch users
    // For now using dummy data
    const dummyUsers = [
      {
        id: 1,
        email: 'user1@example.com',
        registrationDate: '2024-03-21',
        lastLogin: '2024-03-21',
      },
      {
        id: 2,
        email: 'user2@example.com',
        registrationDate: '2024-03-20',
        lastLogin: '2024-03-21',
      },
    ];
    setUsers(dummyUsers);
  }, []);

  const handleDeleteUser = (userId) => {
    // TODO: Implement delete functionality
    toast({
      title: 'User deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Heading size="lg" color="#394C8C">Users</Heading>
      </Flex>

      <Box
        bg={bg}
        shadow="xl"
        rounded="lg"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th bg={headerBg} color={headerColor}>Email</Th>
              <Th bg={headerBg} color={headerColor}>Registration Date</Th>
              <Th bg={headerBg} color={headerColor}>Last Login</Th>
              <Th bg={headerBg} color={headerColor}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.email}</Td>
                <Td>{user.registrationDate}</Td>
                <Td>{user.lastLogin}</Td>
                <Td>
                  <IconButton
                    aria-label="Delete user"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteUser(user.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Users; 