import classNames from 'classnames/bind';
import styles from '~/Pages/Payment/Payment.module.scss';

import StartPartPage from '~/Components/StartPartPage/StartPartPage';

import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { Link, useLocation } from 'react-router-dom';
import OrderAPI from '~/Api/OrderAPI';
import PromotionAPI from '~/Api/PromotionAPI';
import DeliveryInformationAPI from '~/Api/DeliveryInformationAPI';
import DeliveryInformation from '../DeliveryInformation/DeliveryInformation';
import { ShopState } from '~/context/ShopProvider';
import { Box, Button, Image, useToast } from '@chakra-ui/react';
import Paypal from '~/Assets/image/Payment/Paypal.svg';
import VnPay from '~/Assets/image/Payment/vnpay-seeklogo.com.svg';
import { useCartStatus } from '~/Components/CartStatusContext/CartStatusContext';
import axios from 'axios';
import VnpayAPI from '~/Api/VnpayAPI';
import ParrotSpeciesColorAPI from '~/Api/ParrotSpeciesColorAPI';
import { Text } from '@chakra-ui/react';
import ParrotAPI from '~/Api/ParrotAPI';
import ParrotCoupleAPI from '~/Api/ParrotCoupleAPI';
import NestUsageHistoryAPI from '~/Api/NestUsageHistoryAPI';
import NestAPI from '~/Api/NestAPI';
import UserAPI from '~/Api/UserAPI';

const cx = classNames.bind(styles);

function Payment() {
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [listOrder, setListOrder] = useState([]);
    const location = useLocation();
    const receivedData = location.state;
    console.log(receivedData);
    const navigate = useNavigate();
    const { user } = ShopState();
    const [payStatus, setPayStatus] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [originTotalPrice, setOriginTotalPrice] = useState(0);
    const [loggedUser, setLoggedUser] = useState();
    const { paymentStatus, setPaymentStatus } = useCartStatus;
    const [discount, setDiscount] = useState(0);
    const [promotion, setPromotion] = useState(null);
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('accessToken')));
    // const { paymentStatus, setPaymentStatus } = useCartStatus;
    const [orderInfo, setOrderInfo] = useState({
        id: 1,
        createdDate: '2023-10-17',
        userID: 2, // Thay thế bằng giá trị thực tế của userID
        deliveryInformationId: null, // Thay thế bằng giá trị thực tế của deliveryInformationId
        promotionID: null, // Thay thế bằng giá trị thực tế của promotionID
        status: true, // Thay thế bằng giá trị thực tế của status
        totalPrice: 100.0, // Thay thế bằng giá trị thực tế của totalPrice
        quantity: 0, // Thay thế bằng giá trị thực tế của quantity
        vnp_OrderInfo: 'Parrot', // Thay thế bằng thông tin đặt hàng thực tế
        vnp_OrderType: '20000', // Thay thế bằng giá trị thực tế của vnp_OrderType
        vnp_TxnRef: null, // Thay thế bằng giá trị thực tế của vnp_TxnRef
    });

    const [checkNest, setCheckNest] = useState(false);
    const toast = useToast();
    useEffect(() => {
        const getUserByToken = async () => {
            try {
                console.log(token);
                const userByToken = await UserAPI.getUserByToken(token);
                if (
                    userByToken === null ||
                    userByToken === '' ||
                    userByToken === undefined ||
                    userByToken.length === 0
                ) {
                    navigate('/login-user');
                }
                setLoggedUser(userByToken);
                console.log(userByToken);
            } catch (error) {
                console.log(error);
            }
        };
        getUserByToken();
    }, [token]);
    useEffect(() => {
        console.log(loggedUser);
    }, [loggedUser]);
    useEffect(() => {
        console.log(orderInfo);
    }, [orderInfo]);

    const handlePaymentSelection = (paymentMethod) => {
        setPaymentMethod(paymentMethod);
        console.log(paymentMethod);
    };

    const handlePayStatus = async () => {
        if (payStatus) {
            setPayStatus(false);
        } else {
            setPayStatus(true);
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const nowDeliInfo = await DeliveryInformationAPI.getDeliveryInfoWithTruePickingStatusByCustomerId(
            user.id,
            config,
        );
        console.log('selected deli:' + nowDeliInfo.id);
        console.log('click');
    };
    const handlePromotionCode = async () => {
        const code = {
            code: document.getElementById('promotionCode').value,
        };
        console.log(code);
        const codeValue = await PromotionAPI.getCode(code);
        if (codeValue.value > 0) {
            setDiscount(originTotalPrice * codeValue.value);
            setPromotion(codeValue.id);
        } else {
            window.alert('Code does not exist!!');
        }
    };

    useEffect(() => {
        setTotalPrice(originTotalPrice - discount);
    }, [discount]);
    useEffect(() => {
        setListOrder(receivedData);
    }, []);

    useEffect(() => {
        console.log(payStatus);
    }, [payStatus]);

    useEffect(() => {
        if (receivedData) {
            setListOrder(receivedData);
        }
    }, [receivedData]);

    useEffect(() => {
        try {
            if (listOrder[0].isNest) {
                setCheckNest(true);
            }
        } catch (error) {
            console.error(error);
        }
    }, [listOrder]);

    useEffect(() => {
        console.log(receivedData);
    }, []);

    useEffect(() => {
        console.log(checkNest);
    }, [checkNest]);

    useEffect(() => {
        const updateListOrder = async () => {
            try {
                let totalPrice = 0;
                console.log(listOrder.colorID);
                if (listOrder[0].colorID != null) {
                    listOrder.forEach((item) => {
                        totalPrice += item.price * item.quantity;
                        let imgTemp = ParrotSpeciesColorAPI.getImagesByColorId(item.colorID);
                        console.log(totalPrice);
                        imgTemp.then((result) => {
                            item.img = result[0].imageUrl;
                        });
                    });
                    console.log(totalPrice);
                    setTotalPrice(totalPrice);
                    setOriginTotalPrice(totalPrice);
                } else {
                    totalPrice = receivedData[0].nestPrice.price;
                    setTotalPrice(totalPrice);
                    setOriginTotalPrice(totalPrice);
                }
            } catch (error) {
                console.error(error);
            }
        };

        updateListOrder();
    }, [listOrder]);

    // useEffect(() => {
    const addOrders = async () => {
        if (checkNest == false) {
            try {
                const cartList = listOrder.map((item, index) => ({
                    speicesId: item.colorID, // Sử dụng item.colorID thay vì receivedData.colorID
                    quantity: item.quantity,
                    type: 'parrot',
                }));

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                const nowDeliInfo = await DeliveryInformationAPI.getDeliveryInfoWithTruePickingStatusByCustomerId(
                    user.id,
                    config,
                );

                const data = {
                    orderDTO: {
                        // userID: 1,
                        deliveryInformationId: nowDeliInfo.id,
                        promotionID: promotion,
                        userID: user.id,
                        status: 'pending',
                    },
                    cartList: cartList,
                };
                if (nowDeliInfo.id === null || nowDeliInfo.id === undefined || nowDeliInfo.id === '') {
                    toast({
                        title: 'Select an Delivery',
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom',
                    });
                    return;
                }

                const addOrder = await OrderAPI.add(data);
                if (addOrder !== null) {
                    const response = await VnpayAPI.add(addOrder);
                    console.log(addOrder);
                    console.log(response);
                    window.location.href = response;
                    if (response.status === 200) {
                        console.log('Payment Sucessful');
                    } else {
                        console.error('payment not successful ', response.status);
                    }
                } else {
                    console.error('payment not successful ');
                }

                console.log('Order added:', addOrder);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const addFirstParrot = await ParrotAPI.add(listOrder[0].firstParrot);
                const addSecondParrot = await ParrotAPI.add(listOrder[0].secondParrot);
                const addParrotCouple = await ParrotCoupleAPI.add({
                    parrotMaleId: addFirstParrot.gender === true ? addFirstParrot.id : addSecondParrot.id,
                    parrotFemaleId: addSecondParrot.gender === false ? addSecondParrot.id : addFirstParrot.id,
                    status: true,
                });
                const getNestBySpeciesID = await NestAPI.findOneBySpeciesId({
                    speciesId: listOrder[0].id,
                });
                const addNestUsageHistory = await NestUsageHistoryAPI.add({
                    parrotCoupleId: addParrotCouple.id,
                    nestId: getNestBySpeciesID.id,
                    startDate: null,
                    endDate: null,
                });
                const cartList = listOrder.map((item, index) => ({
                    speicesId: addNestUsageHistory.id, // Sử dụng item.colorID thay vì receivedData.colorID
                    quantity: 1,
                    type: 'nest',
                }));
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                const nowDeliInfo = await DeliveryInformationAPI.getDeliveryInfoWithTruePickingStatusByCustomerId(
                    user.id,
                    config,
                );
                const data = {
                    orderDTO: {
                        // userID: 1,
                        deliveryInformationId: nowDeliInfo.id,
                        promotionID: promotion,
                        userID: user.id,
                        status: 'pending',
                    },
                    cartList: cartList,
                };
                if (nowDeliInfo.id === null || nowDeliInfo.id === undefined || nowDeliInfo.id === '') {
                    toast({
                        title: 'Select an Delivery',
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom',
                    });
                    return;
                }

                console.log(selectedDelivery);
                // await DeliveryInformationAPI.updatePickingStatus(1, selectedDelivery);
                const addOrder = await OrderAPI.add(data);

                const response = await VnpayAPI.add(addOrder);
                console.log(addOrder);
                console.log(response);
                window.location.href = response;
                if (response.status === 200) {
                    console.log('Payment Sucessful');
                } else {
                    console.error('payment not successful ', response.status);
                }

                console.log('Order added:', addOrder);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
        // setPaymentStatus((prev) => prev + 1);
    };

    //     if (payStatus) {
    //         addOrders();
    //     }
    //     // navigate('/paid-success');
    // }, [payStatus]);

    useEffect(() => {
        console.log(listOrder);
    }, [listOrder]);

    const handlePayment = async () => {
        try {
            const data = {
                id: orderInfo.id,
                createdDate: orderInfo.createdDate,
                userID: orderInfo.userID,
                deliveryInformationId: orderInfo.deliveryInformationId,
                promotionID: orderInfo.promotionID,
                status: orderInfo.status,
                totalPrice: orderInfo.totalPrice,
                quantity: orderInfo.quantity,
                vnp_OrderInfo: orderInfo.vnp_OrderInfo,
                vnp_OrderType: orderInfo.vnp_OrderType,
                vnp_TxnRef: orderInfo.vnp_TxnRef,
            };
            if (
                orderInfo.deliveryInformationId === null ||
                orderInfo.deliveryInformationId === undefined ||
                orderInfo.deliveryInformationId === ''
            ) {
                toast({
                    title: 'Select an Delivery',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                    duration: 9000,
                    isClosable: true,
                });
                return;
            }
            const response = await VnpayAPI.add(data);

            console.log(response);
            window.location.href = response;
            if (response.status === 200) {
                console.log('Payment Sucessful');
            } else {
                console.error('payment not successful ', response.status);
            }

            // setPaymentStatus(true);
        } catch (error) {
            console.error('Error:', error);
            // setPaymentStatus(false);
        }
    };
    useEffect(() => {
        console.log(selectedDelivery);
    }, [selectedDelivery]);
    return (
        <div className={cx('wrapper')}>
            <StartPartPage payment>Payment</StartPartPage>

            <div className={cx('payment', 'row')}>
                <div className={cx('payment-method', 'col-md-8')}>
                    <div className={cx('payment-method-title')}>
                        <p>Payment method</p>
                    </div>

                    <div className={cx('payment-method-item-container')}>
                        <button
                            disabled
                            className={cx('payment-method-item')}
                            onClick={() => handlePaymentSelection('vnpay')}
                        >
                            <Box width="100%" height="24px">
                                <Image src={VnPay} margin="auto auto" height="100%"></Image>
                            </Box>
                        </button>
                    </div>
                    <div className={cx('delivery-info-component')}>
                        <DeliveryInformation
                            selectedDelivery={selectedDelivery}
                            setSelectedDelivery={setSelectedDelivery}
                        />
                    </div>
                </div>
                <div className={cx('payment-detail', 'col-md-4')}>
                    <Box className={cx('payment-detail-container')}>
                        <Text fontWeight={600} textAlign="center">
                            {checkNest ? 'Nest' : 'Parrot'} Service
                        </Text>
                        {listOrder &&
                            listOrder.map((item, index) => (
                                <div key={index} className={cx('payment-detail-items')}>
                                    <div className={cx('payment-detail-items-info')}>
                                        <div className={cx('payment-detail-items-img')}>
                                            <img src={item.img} alt="product" />
                                        </div>
                                        <div className={cx('payment-detail-items-name-color')}>
                                            <p className={cx('payment-detail-items-quantity')}>{item.name}</p>
                                            <p className={cx('payment-detail-items-quantity')}>{item.color}</p>
                                        </div>

                                        <p className={cx('payment-detail-items-quantity')}>
                                            x{checkNest ? 1 : item.quantity}
                                        </p>
                                        <p className={cx('payment-detail-items-price')}>
                                            $ {checkNest ? item.nestPrice.price : item.price}
                                        </p>
                                    </div>
                                </div>
                            ))}

                        <div className={cx('payment-detail-promotions')}>
                            <input
                                className={cx('payment-detail-promotions-input')}
                                id="promotionCode"
                                type="text"
                                placeholder="Discount code"
                            />
                            <button onClick={() => handlePromotionCode()}>Apply</button>
                        </div>

                        <div className={cx('payment-detail-money')}>
                            <div className={cx('payment-detail-money-item')}>
                                <p className={cx('payment-detail-money-item-title')}>Subtotal</p>
                                <p className={cx('payment-detail-money-item-price')}>$ {originTotalPrice}</p>
                            </div>

                            <div className={cx('payment-detail-money-item')}>
                                <p className={cx('payment-detail-money-item-title')}>Discount</p>
                                <p className={cx('payment-detail-money-item-price')}>$ {discount}</p>
                            </div>

                            <div className={cx('payment-detail-money-item', 'total')}>
                                <p className={cx('payment-detail-money-item-title', 'bold')}>Total</p>
                                <p className={cx('payment-detail-money-item-price')}>$ {totalPrice}</p>
                            </div>
                        </div>
                        <Button
                            colorScheme="blue"
                            height="50px"
                            width="100%"
                            className={cx('pay-btn')}
                            fontSize="16px"
                            onClick={() => addOrders()}
                        >
                            Pay
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default Payment;
