import classNames from 'classnames/bind';
import FeedbackAPI from '~/Api/FeedbackAPI';
import styles from '~/Pages/OrderHistoryNew/OrderHistoryNew.module.scss';

import { Button, ButtonGroup, Text } from '@chakra-ui/react';
import ButtonT from '~/Components/Button/Button';

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    MinusIcon,
    AddIcon,
    Container,
    Image,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Stack,
    Heading,
    Divider,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';

import { ShopState } from '~/context/ShopProvider';
import { useCartStatus } from '~/Components/CartStatusContext/CartStatusContext';

import OrderAPI from '~/Api/OrderAPI';
import Rate from '~/Components/Rate/Rate';

const cx = classNames.bind(styles);

const steps = [
    { title: 'Watiting for parrot', description: 'Contact Info' },
    { title: 'Parrot received', description: 'Date & Time' },
    { title: 'Inspecting', description: 'Select Rooms' },
    { title: 'Verification successful', description: 'Select Rooms' },
    { title: 'Start pairing', description: 'Select Rooms' },
    { title: 'Pregnant', description: 'Select Rooms' },
    { title: 'Gave birth', description: 'Select Rooms' },
    { title: 'Incubating', description: 'Select Rooms' },
    { title: 'Hatched', description: 'Select Rooms' },
    { title: 'Ready to deliver', description: 'Select Rooms' },
    { title: 'Delivered to the shipping unit', description: 'Select Rooms' },
    { title: 'Delivering to you', description: 'Select Rooms' },
    { title: 'Delivered successfully', description: 'Select Rooms' },
];

function OrderHistoryNew() {
    const [rating, setRating] = useState(0);
    const [textareaValue, setTextareaValue] = useState('');
    const [orders, setOrders] = useState([]);
    const [loggedUser, setLoggedUser] = useState();

    const { activeStep } = useSteps({
        index: 1,
        count: steps.length,
    });

    const OverlayOne = () => <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = React.useState(<OverlayOne />);

    const handleTextareaChange = (event) => {
        // Update the state variable with the new value from the textarea
        setTextareaValue(event.target.value);
        console.log(textareaValue);
    };
    const [orderId, setOrderId] = useState({});
    const handleStoreOrderId = (e) => {
        setOrderId(e);
    };
    useEffect(() => {
        console.log(orderId);
    }, [orderId]);
    const handleSaveFeedback = () => {
        // Update the state variable with the new value from the textarea
        console.log(orders);
        const feedbackParam = {
            content: textareaValue,
            rating: rating,
            belongTo: 'parrot',
            userId: orderId.userId,
            colorId: orderId.colorId,
            orderId: orderId.orderId,
            status: true,
        };
        console.log(orderId);
        FeedbackAPI.create(feedbackParam);
        document.getElementById(orderId.btnId).disabled = true;
        document.getElementById(orderId.btnId).style.backgroundColor = 'grey';

        onClose();
    };

    useEffect(() => {
        const checkFeedbackButton = async () => {
            for (const items of orders) {
                const check = await FeedbackAPI.checkFeedbacked({ orderId: items.orderDTO.id });
                if (check > 0) {
                    document.getElementById('btnf' + items.orderDTO.id).disabled = true;
                    document.getElementById('btnf' + items.orderDTO.id).style.backgroundColor = 'grey';
                    document.getElementById('btnf' + items.orderDTO.id).style.cursor = 'Default';
                }
            }
        };
        checkFeedbackButton();
    }, [orders]);

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    }, []);

    const { user } = ShopState();
    const { addToCartStatus } = useCartStatus();

    useEffect(() => {
        const getOrders = async () => {
            try {
                const orderList = await OrderAPI.findAllByUserId(user.userId);
                setOrders(orderList);
                console.log(orderList[0].orderDTO.createdDate);
                console.log(orderList);
            } catch (error) {
                console.error(error);
            }
        };

        getOrders();
    }, [loggedUser]);

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <Container className={cx('wrapper')} maxW="container.xl">
            <Box>
                <Text fontSize="20px" fontWeight="600">
                    Order History
                </Text>
                <Text>View your order</Text>
            </Box>
            <div className={cx('order-container')}>
                {orders.map((order, index) => (
                    <div key={index} className={cx('order-item')}>
                        <div className={cx('order-item-header-container')}>
                            <div className={cx('order-item-header')}>
                                <Text fontSize="16px" fontWeight="500">
                                    Order #{order.orderDTO.id}
                                </Text>
                                <Text fontSize="16px" fontWeight="600" color="green">
                                    Complete
                                </Text>
                            </div>
                            <p className={cx('order-item-header-date')}>{order.orderDTO.createdDate}</p>
                        </div>
                        <div className={cx('order-item-content-container')}>
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Image</Th>
                                            <Th>Name</Th>
                                            <Th>Color</Th>
                                            <Th>Quantity</Th>
                                            <Th>Price</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {order.listOrderDetailHistoryModel.map((parrot, parrotIndex) => (
                                            <Tr key={parrotIndex} className={cx('order-item-content-row')}>
                                                <Td>
                                                    <Image
                                                        borderRadius="full"
                                                        boxSize="60px"
                                                        src="https://images.unsplash.com/photo-1588336142586-36aff13141fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHBhcnJvdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                                                        alt="Dan Abramov"
                                                    />
                                                </Td>
                                                <Td>{parrot.speciesName}</Td>
                                                <Td>{parrot.color}</Td>
                                                <Td>x{parrot.quantity}</Td>
                                                <Td>$ {parrot.price}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>

                            <Card maxW="lg">
                                <CardBody>
                                    <Stack mt="6" spacing="3">
                                        <Heading size="lg" minHeight={10}>
                                            Order Summary
                                        </Heading>
                                        <Text>2 items</Text>
                                        <Text color="blue.600" fontSize="2xl">
                                            Total: $ {order.orderDTO.totalPrice}
                                        </Text>
                                    </Stack>
                                </CardBody>
                                <Divider />
                                <CardFooter>
                                    <ButtonGroup spacing="2">
                                        <div className={cx('rating-btn')}>
                                            <ButtonT
                                                id={'btnf' + order.orderDTO.id}
                                                backgroundColorBlue
                                                colorScheme="blue"
                                                size="lg"
                                                fontSize={'15px'}
                                                onClick={() => {
                                                    handleStoreOrderId({
                                                        orderId: order.orderDTO.id,
                                                        userId: order.orderDTO.userID,
                                                        colorId: order.listOrderDetailHistoryModel[0].colorId,
                                                        btnId: 'btnf' + order.orderDTO.id,
                                                    });
                                                    setOverlay(<OverlayOne />);
                                                    onOpen();
                                                }}
                                            >
                                                Feedback
                                            </ButtonT>
                                            <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
                                                {overlay}
                                                <ModalContent>
                                                    <ModalHeader>Rate Product</ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody>
                                                        <div className={cx('rate-area')}>
                                                            <div className={cx('product-container')}>
                                                                <div className={cx('product-img')}>
                                                                    <img
                                                                        src="https://images.unsplash.com/photo-1630159914088-a1895c434cc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHBhcnJvdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                                                                        alt="product-img"
                                                                    />
                                                                </div>
                                                                <div className={cx('product-info')}>
                                                                    <div className={cx('product-title')}>
                                                                        <p>
                                                                            {
                                                                                order.listOrderDetailHistoryModel[0]
                                                                                    .speciesName
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className={cx('product-type')}>
                                                                        <p>
                                                                            Category:{' '}
                                                                            {order.listOrderDetailHistoryModel[0].color}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className={cx('rating-star-container')}>
                                                                <div className={cx('rating-star-title')}>
                                                                    <p>Rating:</p>
                                                                </div>
                                                                <div className={cx('rating-star-icon')}>
                                                                    <div className={cx('row')}>
                                                                        <div className={cx('col text-center')}>
                                                                            <Rate
                                                                                rating={rating}
                                                                                onRating={(rate) => setRating(rate)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className={cx('rating-input')}>
                                                                <p>Description:</p>
                                                                <textarea
                                                                    maxLength={150}
                                                                    value={textareaValue}
                                                                    onChange={handleTextareaChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </ModalBody>
                                                    <ModalFooter className={cx('button-footer')}>
                                                        <Button
                                                            key={order.orderDTO.id + 1000}
                                                            value={order.orderDTO.id}
                                                            onClick={() => {
                                                                handleSaveFeedback();
                                                            }}
                                                        >
                                                            Save
                                                        </Button>
                                                        <p>{order.orderDTO.id}</p>

                                                        <Button onClick={onClose}>Close</Button>
                                                    </ModalFooter>
                                                </ModalContent>
                                            </Modal>

                                            {/* <Modal isOpen={isOpen} onClose={onClose} w>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Rate Product</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                
                                            </ModalBody>

                                            <ModalFooter>
                                                <Button colorScheme="blue" mr={3} onClick={onClose}>
                                                    Close
                                                </Button>
                                                <Button variant="ghost">Secondary Action</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal> */}
                                        </div>

                                        <Button
                                            variant="solid"
                                            colorScheme="green"
                                            onClick={() => {
                                                setOverlay(<OverlayOne />);
                                                onOpen();
                                            }}
                                        >
                                            Track Process
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                ))}
                {/* <Modal isCentered isOpen={isOpen} onClose={onClose} size="5xl">
                    {overlay}
                    <ModalContent>
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stepper size="lg" index={activeStep} orientation="vertical">
                                {steps.map((step, index) => (
                                    <Step key={index}>
                                        <StepIndicator>
                                            <StepStatus
                                                complete={<StepIcon />}
                                                incomplete={<StepNumber />}
                                                active={<StepNumber />}
                                            />
                                        </StepIndicator>

                                        <Box flexShrink="0">
                                            <StepTitle>{step.title}</StepTitle>
                                            <StepDescription>{step.description}</StepDescription>
                                        </Box>

                                        <StepSeparator />
                                    </Step>
                                ))}
                            </Stepper>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal> */}
            </div>
        </Container>
    );
}

export default OrderHistoryNew;
