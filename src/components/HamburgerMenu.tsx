import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface MenuOption {
    id: string;
    label: string;
    icon: string;
    onPress: () => void;
    color?: string;
}

interface User {
    username: string;
    phoneNumber: string;
    points: number;
}

interface HamburgerMenuProps {
    options: MenuOption[];
    user: User;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ options, user }) => {
    const [isVisible, setIsVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(-width)).current;

    const showMenu = () => {
        setIsVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideMenu = () => {
        Animated.timing(slideAnim, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsVisible(false);
        });
    };

    const handleOptionPress = (option: MenuOption) => {
        hideMenu();
        setTimeout(() => {
            option.onPress();
        }, 300);
    };

    return (
        <>
            <TouchableOpacity onPress={showMenu} style={styles.hamburgerButton}>
                <View style={styles.line} />
                <View style={styles.line} />
                <View style={styles.line} />
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                transparent
                animationType="none"
                onRequestClose={hideMenu}
            >
                <View style={styles.overlay}>
                    <Animated.View
                        style={[
                            styles.menuContainer,
                            {
                                transform: [{ translateX: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.menuHeader}>
                            <View style={styles.userInfo}>
                                <View style={styles.profileImageContainer}>
                                    <View style={styles.profileImagePlaceholder}>
                                        <Text style={styles.profileImageText}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.userName}>{user.username}</Text>
                                <Text style={styles.userEmail}>{user.phoneNumber}</Text>
                                <View style={styles.balanceContainer}>
                                    <Text style={styles.balanceLabel}>💰 Balance</Text>
                                    <Text style={styles.balanceText}>KES {user.points}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={hideMenu} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.menuItems}>
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={styles.menuItem}
                                    onPress={() => handleOptionPress(option)}
                                >
                                    <Text style={styles.menuIcon}>{option.icon}</Text>
                                    <Text
                                        style={[
                                            styles.menuItemText,
                                            option.color && { color: option.color },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.menuFooter}>
                            <Text style={styles.footerText}>PataPesa App v1.0</Text>
                        </View>
                    </Animated.View>
                    <TouchableOpacity
                        style={styles.overlayBackground}
                        activeOpacity={1}
                        onPress={hideMenu}
                    />
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    hamburgerButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        width: 24,
        height: 3,
        backgroundColor: '#333',
        marginVertical: 2,
        borderRadius: 2,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    overlayBackground: {
        position: 'absolute',
        top: 0,
        left: width * 0.8,
        right: 0,
        bottom: 0,
    },
    menuContainer: {
        width: width * 0.8,
        height: '100%',
        backgroundColor: 'white',
        paddingTop: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    userInfo: {
        flex: 1,
        alignItems: 'center',
    },
    profileImageContainer: {
        marginBottom: 12,
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(91, 175, 120, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileImageText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    balanceContainer: {
        backgroundColor: 'rgba(91, 175, 120, 1)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    balanceLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 2,
        textAlign: 'center',
    },
    balanceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    userBalance: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(91, 175, 120, 1)',
    },
    menuTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 20,
        color: '#666',
    },
    menuItems: {
        flex: 1,
        paddingTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 15,
        width: 25,
        textAlign: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    menuFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});
