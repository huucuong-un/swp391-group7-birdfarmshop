import classNames from 'classnames/bind';
import styles from '~/Pages/ParrotDetail/ParrotDetail.module.scss';

import StartPartPage from '~/Components/StartPartPage/StartPartPage';
import ParrotSpeciesAPI from '~/Api/ParrotSpeciesAPI';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box } from '@chakra-ui/react';

import { useState, useEffect } from 'react';

import { Link, useParams, useLocation } from 'react-router-dom';
import ParrotAPI from '~/Api/ParrotAPI';
import Button from '~/Components/Button/Button';
import Feedback from '~/Components/Feedback/Feedback';

const cx = classNames.bind(styles);

function ParrotDetail() {
    const location = useLocation();
    const receivedData = location.state;
    console.log(receivedData);
    const { id } = useParams();
    const [selectedColor, setSelectedColor] = useState({});
    const [selectedColorId, setSelectedColorId] = useState(receivedData.selectedColor.colorId);
    const [quantities, setQuantities] = useState(1);
    const [combineData, setCombineData] = useState([]);
    const [parrotSpecies, setParrotSpecies] = useState([]);
    const [count, setCount] = useState(0);
    const [totalParrotsInCart, setTotalParrotsInCart] = useState(0);

    const [countParrot, setCountParrot] = useState('Check the color to see ');

    console.log(selectedColorId);
    const handleColorSelection = async (parrotId, color, price, colorId) => {
        setSelectedColor({
            ...selectedColor,
            [parrotId]: {
                color: color,
                price: price,
                colorId: colorId,
            },
        });

        setSelectedColorId(colorId);
    };

    const handleQuantityIncrease = (parrotId) => {
        if (quantities[parrotId] < countParrot) {
            setQuantities((prevQuantities) => ({
                ...prevQuantities,
                [parrotId]: (prevQuantities[parrotId] || 0) + 1, // Tăng quantity cho parrot cụ thể
            }));
        }
    };

    const handleQuantityDecrease = (parrotId) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [parrotId]: Math.max((prevQuantities[parrotId] || 0) - 1, 1), // Giới hạn số lượng tối thiểu là 1
        }));
    };

    useEffect(() => {
        const getParrotsSpecies = async () => {
            try {
                const parrotSpeciesById = await ParrotSpeciesAPI.get(id);
                setParrotSpecies(parrotSpeciesById);
                console.log(parrotSpecies);
            } catch (error) {
                console.error(error);
            }
        };

        // Gọi hàm getParrots khi component được mount
        getParrotsSpecies();
        console.log(parrotSpecies);
    }, []);

    useEffect(() => {
        const getCountAvailableParrotId = async () => {
            try {
                const availableParrot = await ParrotAPI.countAvailableParrotId(selectedColorId);
                setCountParrot(availableParrot);
            } catch (error) {
                console.error(error);
            }
        };

        getCountAvailableParrotId();
    }, [selectedColorId]);

    useEffect(() => {
        const fetchData = async () => {
            const data = [];
            for (const item of parrotSpecies) {
                const parrot = { ...item };
                try {
                    parrot.colors = await ParrotSpeciesAPI.getListBySpeciesId(item.id);
                    data.push(parrot);
                } catch (error) {
                    console.error(error);
                }
            }

            // const initialSelectedColor = {};
            // data.forEach((parrot) => {
            //     if (parrot.colors.length > 0) {
            //         initialSelectedColor[parrot.id] = {
            //             color: parrot.colors[0].color,
            //             price: parrot.colors[0].price,
            //         };
            //     }
            // });

            // setSelectedColor(initialSelectedColor);

            const initialSelectedColor = {};
            const initialSelectedColorId = {};

            data.forEach((parrot) => {
                if (parrot.colors.length > 0) {
                    let maxColorId = parrot.colors[0].id;
                    let maxColor = parrot.colors[0].color;
                    parrot.colors.forEach((color) => {
                        if (color.id > maxColorId) {
                            maxColorId = color.id;
                            maxColor = color.color;
                        }
                    });
                    initialSelectedColor[parrot.id] = {
                        color: maxColor,
                        price: parrot.colors[0].price,
                        colorId: maxColorId,
                    };
                    initialSelectedColorId[parrot.id] = maxColorId;
                }
            });

            setSelectedColor(initialSelectedColor);
            setSelectedColorId(initialSelectedColorId);

            const initialQuantities = {};
            data.forEach((parrot) => {
                initialQuantities[parrot.id] = 1;
            });
            setQuantities(initialQuantities);

            // Khi tất cả các Promise đã hoàn thành, combineData sẽ chứa tất cả dữ liệu đã được lưu.
            setCombineData(data);
            console.log(combineData);
            // console.log(combineData[1].colors[0].color);
        };

        fetchData();
    }, [parrotSpecies]);

    // useEffect(() => {
    //     const initialQuantities = new Array(combineData.length).fill(1);
    //     setQuantities(initialQuantities);
    // }, [combineData]);

    const handleAddToCart = ({ name, img, quantity, price, color, colorID, id }) => {
        const existingCart = JSON.parse(localStorage.getItem('parrot')) || [];
        const existingItem = existingCart.find((item) => item.name === name && item.color === color);
        let maxId = 0;
        if (existingCart.length != 0) {
            existingCart.forEach((item) => {
                if (item.id > maxId) {
                    maxId = item.id;
                }
            });
        }
        if (existingItem) {
            // Nếu mục đã tồn tại, tăng số lượng lên 1
            existingItem.quantity += 1;
        } else {
            // Nếu mục chưa tồn tại, thêm nó vào danh sách
            existingCart.push({
                id: existingCart.length == 0 ? 0 : maxId + 1,
                name,
                img,
                quantity,
                price,
                color,
                colorID,
            });

            // setTotalParrotsInCart((prevTotal) => prevTotal + 1);
        }
        const newCart = [...existingCart];
        localStorage.setItem('parrot', JSON.stringify(newCart));
        // localStorage.clear();
        const deleteAfterMilliseconds = 365 * 24 * 60 * 60 * 1000; // 1 năm
        // const deleteAfterMilliseconds = 1 * 60 * 1000; // 1 phút
        setTimeout(() => {
            localStorage.removeItem('parrot'); // Xóa dữ liệu sau khoảng thời gian đã đặt
        }, deleteAfterMilliseconds);
    };

    // console.log(selectedColor);

    useEffect(() => {
        console.log(quantities);
    }, [quantities]);

    return (
        <div className={cx('wrapper')}>
            <StartPartPage>Parrot Details</StartPartPage>
            {combineData.map((parrot, index) => {
                const currentParrot = combineData[index];
                return (
                    <div key={index} className={cx('inner')}>
                        <div className={cx('mini-img-container')}>
                            <img src={parrot} alt="mini-image" />
                            <img src={parrot} alt="mini-image" />
                            <img src={parrot} alt="mini-image" />
                            <img src={parrot} alt="mini-image" />
                        </div>

                        <div className={cx('main-img')}>
                            <img src={parrot.img} alt="main-picture" />
                        </div>

                        <div className={cx('parrot-detail-container')}>
                            <p className={cx('parrot-detail-title')}>{parrot.name}</p>
                            <div className={cx('parrot-star')}>
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                            </div>
                            <div className={cx('parrot-detail-price-container')}>
                                <p className={cx('parrot-detail-price-title')}>Price</p>
                                <p className={cx('parrot-detail-price-value')}>{selectedColor[parrot.id]?.price}</p>
                                {/* <p className={cx('parrot-detail-price-value')}>
                                    {selectedColor[parrot.id]?.color || 'N/A'}
                                </p> */}
                                {/* <p className={cx('parrot-detail-price-value')}>
                                    {selectedColor[parrot.id]?.color || 'N/A'}
                                </p> */}
                            </div>

                            <div className={cx('choose-color')}>
                                <p className={cx('choose-color-title')}>Color</p>
                                <div key={index} className={cx('parrot-color')}>
                                    {parrot.colors.map((color, colorIndex) => (
                                        <button
                                            key={colorIndex}
                                            className={cx('parrot-color-item', {
                                                selected: color.color === selectedColor[parrot.id]?.color,
                                            })}
                                            onClick={() =>
                                                handleColorSelection(parrot.id, color.color, color.price, color.id)
                                            }
                                            style={{ backgroundColor: color.color }}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                            <div className={cx('quantity-container')}>
                                <p className={cx('quantity-title')}>Quantity</p>
                                <div className={cx('quanity-space')}>
                                    <div className={cx('quantity-input-container')}>
                                        <button
                                            className={cx('quantity-input-btn')}
                                            onClick={() => handleQuantityDecrease(parrot.id)}
                                        >
                                            -
                                        </button>
                                        <input type="number" value={quantities[parrot.id] || 1} min={1} />
                                        <button
                                            className={cx('quantity-input-btn')}
                                            onClick={() => handleQuantityIncrease(parrot.id)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p>{countParrot} available</p>
                                </div>
                            </div>
                            <Accordion defaultIndex={[0]} allowMultiple>
                                <AccordionItem w={500}>
                                    <h2>
                                        <AccordionButton>
                                            <Box as="span" flex="1" textAlign="left" fontSize={16} fontWeight={500}>
                                                Description
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>{parrot.description}</AccordionPanel>
                                </AccordionItem>
                                <AccordionItem w={500}>
                                    <h2>
                                        <AccordionButton>
                                            <Box as="span" flex="1" textAlign="left" fontSize={16} fontWeight={500}>
                                                Shipping & Return
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        Please Note: There is no restocking fee for this item. However, customers
                                        interested in a return for a refund must pay for the return shipping costs.
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                            <div className={cx('active-zone')}>
                                {countParrot === 0 ? (
                                    <button>Out of stock</button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            handleAddToCart({
                                                id: count,
                                                name: parrot.name,
                                                img: parrot.img,
                                                quantity: quantities[parrot.id],
                                                price: selectedColor[parrot.id]?.price,
                                                color: selectedColor[parrot.id]?.color,
                                                colorID: selectedColor[parrot.id]?.colorId,
                                            })
                                        }
                                    >
                                        Add to cart
                                    </button>
                                )}
                                {countParrot === 0 ? (
                                    <Link to="/" className={cx('buy-btn')}>
                                        Contact
                                    </Link>
                                ) : countParrot === 'Check the color to see ' ? (
                                    <Link className={cx('buy-btn-choose')}>Please choose color</Link>
                                ) : (
                                    <Link
                                        to={`/payment`}
                                        className={cx('buy-btn')}
                                        state={[
                                            {
                                                // name: combineData[0].name,
                                                // quantity: parseInt(quantities[1]),
                                                // img: combineData[0].img,

                                                // color: selectedColor[1].color,
                                                // colorID: selectedColor[1].colorId,
                                                // price: selectedColor[1].price,

                                                name: currentParrot.name,
                                                quantity: parseInt(quantities[currentParrot.id]),
                                                img: currentParrot.img,
                                                color: selectedColor[currentParrot.id]?.color,
                                                colorID: selectedColor[currentParrot.id]?.colorId,
                                                price: selectedColor[currentParrot.id]?.price,
                                            },
                                        ]}
                                    >
                                        Buy
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            <Feedback></Feedback>
        </div>
    );
}

export default ParrotDetail;
