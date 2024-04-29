import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, HStack, Text, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const data = await client.getWithPrefix("customer:");
    if (data) {
      setCustomers(data.map((d) => ({ id: d.key, ...d.value })));
    }
  };

  const addCustomer = async () => {
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Name and email cannot be empty",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const key = `customer:${Date.now()}`;
    const success = await client.set(key, { name, email });
    if (success) {
      fetchCustomers();
      setName("");
      setEmail("");
      toast({
        title: "Customer added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteCustomer = async (id) => {
    const success = await client.delete(id);
    if (success) {
      fetchCustomers();
      toast({
        title: "Customer deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <HStack>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addCustomer}>
            Add Customer
          </Button>
        </HStack>
        {customers.map((customer) => (
          <HStack key={customer.id} w="full" justify="space-between">
            <Text>
              {customer.name} - {customer.email}
            </Text>
            <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => deleteCustomer(customer.id)}>
              Delete
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;
