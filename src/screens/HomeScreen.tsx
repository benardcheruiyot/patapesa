import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    ScrollView,
    Animated,
    Modal,
} from 'react-native';
import { SpinWheel } from '../components/SpinWheel';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { WithdrawScreen } from './WithdrawScreen';
import { ActivateAccountScreen } from './ActivateAccountScreen';
import { ReferralScreen } from './ReferralScreen';
import { ContactUsScreen } from './ContactUsScreen';
import { AuthService, User } from '../utils/auth';
import { useNotifications } from '../context/NotificationProvider';

interface HomeScreenProps {
    user: User;
    onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user, onLogout }) => {
    const [currentUser, setCurrentUser] = useState<User>(user);
    const [canActivate, setCanActivate] = useState(false);
    const [isActivated, setIsActivated] = useState(user.isActivated || false);
    const [isPendingActivation, setIsPendingActivation] = useState(user.pendingActivation || false);
    const notifications = useNotifications();
    const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
    const [referralClicks, setReferralClicks] = useState(0);
    const [hasUsedBonusSpin, setHasUsedBonusSpin] = useState(user.hasUsedFreeSpin || false);
    const [showSpinModal, setShowSpinModal] = useState(false);
    const [showWithdrawScreen, setShowWithdrawScreen] = useState(false);
    const [showActivateScreen, setShowActivateScreen] = useState(false);
    const [showReferralScreen, setShowReferralScreen] = useState(false);
    const [showContactUsScreen, setShowContactUsScreen] = useState(false);
    const scrollY = React.useRef(new Animated.Value(0)).current;
    
    // Gift drop animations
    const giftAnimation1 = React.useRef(new Animated.Value(-50)).current;
    const giftAnimation2 = React.useRef(new Animated.Value(-50)).current;
    const giftAnimation3 = React.useRef(new Animated.Value(-50)).current;
    const giftAnimation4 = React.useRef(new Animated.Value(-50)).current;
    const giftAnimation5 = React.useRef(new Animated.Value(-50)).current;
    const giftAnimation6 = React.useRef(new Animated.Value(-50)).current;
    const giftAnimation7 = React.useRef(new Animated.Value(-50)).current;
    const giftAnimation8 = React.useRef(new Animated.Value(-50)).current;
    
    // Confetti popper animations (coming out of the box)
    const confetti1Animation = React.useRef(new Animated.Value(0)).current;
    const confetti2Animation = React.useRef(new Animated.Value(0)).current;
    const confetti3Animation = React.useRef(new Animated.Value(0)).current;
    const confetti4Animation = React.useRef(new Animated.Value(0)).current;
    const confetti5Animation = React.useRef(new Animated.Value(0)).current;
    const confetti6Animation = React.useRef(new Animated.Value(0)).current;
    const confetti7Animation = React.useRef(new Animated.Value(0)).current;
    const confetti8Animation = React.useRef(new Animated.Value(0)).current;
    
    // Box opening animation
    const boxOpenAnimation = React.useRef(new Animated.Value(0)).current;
    
    // Overflowing gifts and ribbons animations
    const overflowGift1 = React.useRef(new Animated.Value(0)).current;
    const overflowGift2 = React.useRef(new Animated.Value(0)).current;
    const overflowGift3 = React.useRef(new Animated.Value(0)).current;
    const overflowGift4 = React.useRef(new Animated.Value(0)).current;
    const overflowGift5 = React.useRef(new Animated.Value(0)).current;
    const overflowGift6 = React.useRef(new Animated.Value(0)).current;
    
    // Ribbon animations
    const ribbon1Animation = React.useRef(new Animated.Value(0)).current;
    const ribbon2Animation = React.useRef(new Animated.Value(0)).current;
    const ribbon3Animation = React.useRef(new Animated.Value(0)).current;
    const ribbon4Animation = React.useRef(new Animated.Value(0)).current;
    const ribbon5Animation = React.useRef(new Animated.Value(0)).current;

    // Function to generate random names
    const generateRandomName = () => {
        const firstNames = [
            'John', 'Mary', 'Peter', 'Grace', 'David', 'Susan', 'James', 'Alice', 'Michael', 'Jane',
            'Samuel', 'Ruth', 'Daniel', 'Sarah', 'Joseph', 'Rebecca', 'Paul', 'Elizabeth', 'Mark', 'Joyce',
            'Stephen', 'Faith', 'Anthony', 'Catherine', 'Francis', 'Margaret', 'Patrick', 'Helen', 'Vincent', 'Monica',
            'Thomas', 'Agnes', 'Robert', 'Esther', 'George', 'Mercy', 'Christopher', 'Rose', 'Emmanuel', 'Ann',
            'Isaac', 'Lydia', 'Joshua', 'Gladys', 'Nicholas', 'Edith', 'Frederick', 'Josephine', 'Benjamin', 'Martha',
            'Simon', 'Beatrice', 'Philip', 'Winnie', 'Charles', 'Caroline', 'Kevin', 'Nancy', 'Kenneth', 'Veronica',
            'Timothy', 'Priscilla', 'Moses', 'Stella', 'Collins', 'Eunice', 'Dennis', 'Violet', 'Felix', 'Janet',
            'Harrison', 'Pauline', 'Edwin', 'Dorcas', 'Brian', 'Christine', 'Martin', 'Joy', 'Joel', 'Tabitha',
            'Gerald', 'Naomi', 'Wilson', 'Purity', 'Oscar', 'Charity', 'Arthur', 'Patience', 'Richard', 'Prudence'
        ];

        const lastNames = [
            'Kipkoech',
            'Wekesa',
            'Njoroge',
            'Wekesa',
            'Kiprotich',
            'Mwalimu',
            'Omollo',
            'Kariuki',
            'Wafula',
            'Wasike',
            'Musyoka',
            'Juma',
            'Swaleh',
            'Muriithi',
            'Makokha',
            'Kamau',
            'Mohamed',
            'Wasike',
            'Wanjiru',
            'Owino',
            'Wafula',
            'Warsame',
            'Wanyonyi',
            'Kipkoech',
            'Chepkwony',
            'Wanjiru',
            'Owino',
            'Keter',
            'Abdullahi',
            'Odhiambo',
            'Juma',
            'Farah',
            'Wairimu',
            'Shikuku',
            'Muli',
            'Macharia',
            'Wanyonyi',
            'Kioko',
            'Wekesa',
            'Mshenga',
            'Omollo',
            'Owino',
            'Juma',
            'Njoroge',
            'Kipkorir',
            'Omar',
            'Simiyu',
            'Mohamed',
            'Lagat',
            'Okoth',
            'Juma',
            'Mshenga',
            'Mshenga',
            'Ndeti',
            'Omollo',
            'Kioko',
            'Mwanzia',
            'Owino',
            'Wanyonyi',
            'Muli',
            'Kilonzo',
            'Keter',
            'Gitau',
            'Wanyonyi',
            'Mwangi',
            'Otieno',
            'Omar',
            'Keter',
            'Chelangat',
            'Warsame',
            'Mwanzia',
            'Juma',
            'Bakari',
            'Makokha',
            'Musyoka',
            'Mshenga',
            'Mohamed',
            'Ndung’u',
            'Ramadhan',
            'Onyango',
            'Omar',
            'Nabwera',
            'Hassan',
            'Kipkorir',
            'Warsame',
            'Ogola',
            'Simiyu',
            'Macharia',
            'Kamau',
            'Muriithi',
            'Kamau',
            'Juma',
            'Salim',
            'Mshenga',
            'Muli',
            'Kiplagat',
            'Barasa',
            'Ndeti',
            'Kipkorir',
            'Kariuki',
            'Kassim',
            'Mutiso',
            'Ali',
            'Ali',
            'Macharia',
            'Njoroge',
            'Shikuku',
            'Lagat',
            'Gitau',
            'Wanyonyi',
            'Kipkorir',
            'Simiyu',
            'Hassan',
            'Kassim',
            'Aden',
            'Keter',
            'Okoth',
            'Kitheka',
            'Juma',
            'Owino',
            'Kiplagat',
            'Kiplagat',
            'Mutiso',
            'Omar',
            'Kioko',
            'Hussein',
            'Barasa',
            'Abdi',
            'Mwanzia',
            'Ouma',
            'Kiplagat',
            'Omar',
            'Omollo',
            'Aden',
            'Ndeti',
            'Macharia',
            'Ogola',
            'Makokha',
            'Wanyonyi',
            'Mohamed',
            'Bakari',
            'Kiprotich',
            'Ouma',
            'Wanyonyi',
            'Abdi',
            'Ndung’u',
            'Wafula',
            'Kipkorir',
            'Ndeti',
            'Juma',
            'Salim',
            'Mshenga',
            'Kipkoech',
            'Ochieng',
            'Juma',
            'Kiprop',
            'Barasa',
            'Abdi',
            'Onyango',
            'Odhiambo',
            'Macharia',
            'Ahmed',
            'Kioko',
            'Kipkoech',
            'Ndeti',
            'Lagat',
            'Kariuki',
            'Shikuku',
            'Kariuki',
            'Aden',
            'Kipchoge',
            'Hussein',
            'Abdullahi',
            'Macharia',
            'Wafula',
            'Wairimu',
            'Salim',
            'Macharia',
            'Kioko',
            'Warsame',
            'Ndeti',
            'Okoth',
            'Mwalimu',
            'Wanyonyi',
            'Omar',
            'Kariuki',
            'Mutiso',
            'Musyoka',
            'Kamau',
            'Muasya',
            'Ogola',
            'Nabwera',
            'Wafula',
            'Kiprotich',
            'Kamau',
            'Mohamed',
            'Omar',
            'Ouma',
            'Wanjiru',
            'Ouma',
            'Juma',
            'Ouma',
            'Warsame',
            'Kiprop',
            'Lagat',
            'Chepkwony',
            'Muli',
            'Aden',
            'Kiprop',
            'Wanjiru',
            'Mwanzia',
            'Muli',
            'Kiprotich',
            'Ouma',
            'Onyango',
            'Said',
            'Kamau',
            'Wafula',
            'Ndung’u',
            'Muli',
            'Muasya',
            'Omar',
            'Salim',
            'Kariuki',
            'Ogola',
            'Kassim',
            'Muriithi',
            'Kassim',
            'Ochieng',
            'Kiplagat',
            'Ndung’u',
            'Ouma',
            'Kamau',
            'Said',
            'Mshenga',
            'Kilonzo',
            'Makokha',
            'Omondi',
            'Musyoka',
            'Omar',
            'Mwalimu',
            'Farah',
            'Mutiso',
            'Kassim',
            'Salim',
            'Ogola',
            'Ndeti',
            'Ali',
            'Kitheka',
            'Ouma',
            'Wasike',
            'Kiprop',
            'Kiprotich',
            'Ahmed',
            'Wekesa',
            'Omollo',
            'Ochieng',
            'Njoroge',
            'Wafula',
            'Mwalimu',
            'Ouma',
            'Kipchoge',
            'Said',
            'Omollo',
            'Wafula',
            'Mutua',
            'Keter',
            'Aden',
            'Abdullahi',
            'Bakari',
            'Ndeti',
            'Gitau',
            'Mutiso',
            'Kipkoech',
            'Kamau',
            'Kipchoge',
            'Omollo',
            'Hassan',
            'Kitheka',
            'Hussein',
            'Ouma',
            'Kipkoech',
            'Bakari',
            'Keter',
            'Simiyu',
            'Warsame',
            'Kioko',
            'Omondi',
            'Wairimu',
            'Simiyu',
            'Muriithi',
            'Wanyonyi',
            'Njoroge',
            'Macharia',
            'Otieno',
            'Omollo',
            'Omondi',
            'Wairimu',
            'Juma',
            'Mutua',
            'Ndung’u',
            'Muasya',
            'Juma',
            'Keter',
            'Onyango',
            'Abdullahi',
            'Owino',
            'Musyoka',
            'Mwangi',
            'Wekesa',
            'Ramadhan',
            'Aden',
            'Macharia',
            'Lagat',
            'Mshenga',
            'Mutua',
            'Hassan',
            'Lagat',
            'Farah',
            'Kioko',
            'Mshenga',
            'Lagat',
            'Otieno',
            'Kamau',
            'Kiplagat',
            'Macharia',
            'Ndeti',
            'Muriithi',
            'Chelangat',
            'Muasya',
            'Gitau',
            'Mutiso',
            'Ochieng',
            'Abdi',
            'Ramadhan',
            'Juma',
            'Makokha',
            'Mutiso',
            'Mutua',
            'Mshenga',
            'Ogola',
            'Chepkwony',
            'Makokha',
            'Farah',
            'Farah',
            'Juma',
            'Mshenga',
            'Salim',
            'Wanyonyi',
            'Njoroge',
            'Njoroge',
            'Shikuku',
            'Hassan',
            'Kitheka',
            'Ahmed',
            'Kipkoech',
            'Kiplagat',
            'Njoroge',
            'Muli',
            'Said',
            'Wanjiru',
            'Salim',
            'Chelangat',
            'Barasa',
            'Wekesa',
            'Makokha',
            'Mutua',
            'Barasa',
            'Owino',
            'Muasya',
            'Muasya',
            'Wafula',
            'Ndung’u',
            'Ramadhan',
            'Aden',
            'Omar',
            'Mshenga',
            'Mshenga',
            'Abdi',
            'Kitheka',
            'Barasa',
            'Macharia',
            'Juma',
            'Kariuki',
            'Mwalimu',
            'Mohamed',
            'Ndung’u',
            'Said',
            'Lagat',
            'Wanjiru',
            'Abdi',
            'Njoroge',
            'Shikuku',
            'Shikuku',
            'Kariuki',
            'Musyoka',
            'Mwanzia',
            'Macharia',
            'Omondi',
            'Kipkoech',
            'Owino',
            'Chepkwony',
            'Keter',
            'Wekesa',
            'Barasa',
            'Kamau',
            'Simiyu',
            'Juma',
            'Simiyu',
            'Kipchoge',
            'Wasike',
            'Hassan',
            'Otieno',
            'Bakari',
            'Kiprotich',
            'Onyango',
            'Mutiso',
            'Chepkwony',
            'Chelangat',
            'Hussein',
            'Ramadhan',
            'Omondi',
            'Wairimu',
            'Mohamed',
            'Farah',
            'Kitheka',
            'Musyoka',
            'Ndeti',
            'Kipkorir',
            'Barasa',
            'Chepkwony',
            'Barasa',
            'Nabwera',
            'Ali',
            'Kamau',
            'Mutiso',
            'Ogola',
            'Ogola',
            'Omondi',
            'Kiprop',
            'Warsame',
            'Onyango',
            'Ogola',
            'Gitau',
            'Kipkoech',
            'Mwalimu',
            'Ouma',
            'Abdullahi',
            'Kiprotich',
            'Omollo',
            'Ahmed',
            'Ali',
            'Kiprotich',
            'Kiprop',
            'Juma',
            'Bakari',
            'Muriithi',
            'Mutiso',
            'Juma',
            'Salim',
            'Kassim',
            'Farah',
            'Mutua',
            'Ndung’u',
            'Muli',
            'Mutiso',
            'Omondi',
            'Abdullahi',
            'Kitheka',
            'Nabwera',
            'Swaleh',
            'Ahmed',
            'Odhiambo',
            'Ndung’u',
            'Mwangi',
            'Omollo',
            'Mutua',
            'Said',
            'Njoroge',
            'Otieno',
            'Musyoka',
            'Wafula',
            'Kipchoge',
            'Okoth',
            'Kilonzo',
            'Nabwera',
            'Muasya',
            'Nabwera',
            'Wanyonyi',
            'Ali',
            'Kamau',
            'Macharia',
            'Hassan',
            'Onyango',
            'Kiprotich',
            'Juma',
            'Onyango',
            'Kariuki',
            'Nabwera',
            'Bakari',
            'Ramadhan',
            'Okoth',
            'Ahmed',
            'Bakari',
            'Ndung’u',
            'Omondi',
            'Owino',
            'Njoroge',
            'Muasya',
            'Kariuki',
            'Ochieng',
            'Wairimu',
            'Barasa',
            'Bakari',
            'Chelangat',
            'Mwanzia',
            'Bakari',
            'Chelangat',
            'Makokha',
            'Kariuki',
            'Owino',
            'Aden',
            'Omondi',
            'Omollo',
            'Kamau',
            'Kitheka',
            'Kariuki',
            'Owino',
            'Kipkoech',
            'Nabwera',
            'Kiplagat',
            'Aden',
            'Kipkoech',
            'Kitheka',
            'Omar',
            'Kariuki',
            'Chepkwony',
            'Mohamed',
            'Warsame',
            'Kiplagat',
            'Ogola',
            'Kamau',
            'Muasya',
            'Musyoka',
            'Bakari',
            'Hussein',
            'Kioko',
            'Mwangi',
            'Bakari',
            'Muasya',
            'Omar',
            'Lagat',
            'Farah',
            'Kipkoech',
            'Mohamed',
            'Hussein',
            'Abdullahi',
            'Kipchoge',
            'Ahmed',
            'Odhiambo',
            'Juma',
            'Salim',
            'Juma',
            'Ali',
            'Bakari',
            'Njoroge',
            'Ali',
            'Kamau',
            'Njoroge',
            'Njoroge',
            'Ndeti',
            'Mwanzia',
            'Said',
            'Ndeti',
            'Chelangat',
            'Omar',
            'Ali',
            'Kipkoech',
            'Ogola',
            'Warsame',
            'Chelangat',
            'Omondi',
            'Farah',
            'Wafula',
            'Ali',
            'Makokha',
            'Ndung’u',
            'Ndung’u',
            'Ndeti',
            'Hassan',
            'Wanjiru',
            'Onyango',
            'Kamau',
            'Kamau',
            'Ramadhan',
            'Kipchoge',
            'Okoth',
            'Said',
            'Mwanzia',
            'Kamau',
            'Wasike',
            'Simiyu',
            'Juma',
            'Okoth',
            'Warsame',
            'Makokha',
            'Hassan',
            'Juma',
            'Odhiambo',
            'Salim',
            'Shikuku',
            'Omollo',
            'Owino',
            'Juma',
            'Gitau',
            'Mshenga',
            'Ndeti',
            'Ochieng',
            'Wasike',
            'Aden',
            'Juma',
            'Mutua',
            'Mutua',
            'Okoth',
            'Simiyu',
            'Mwanzia',
            'Muasya',
            'Kipchoge',
            'Muli',
            'Musyoka',
            'Mshenga',
            'Wasike',
            'Mwangi',
            'Wanyonyi',
            'Abdullahi',
            'Mwanzia',
            'Omondi',
            'Ndung’u',
            'Keter',
            'Onyango',
            'Aden',
            'Mwangi',
            'Ndeti',
            'Owino',
            'Kilonzo',
            'Keter',
            'Mshenga',
            'Ogola',
            'Muriithi',
            'Kioko',
            'Okoth',
            'Juma',
            'Okoth',
            'Aden',
            'Omar',
            'Mwangi',
            'Mwangi',
            'Abdullahi',
            'Wanjiru',
            'Wairimu',
            'Owino',
            'Muasya',
            'Muasya',
            'Muriithi',
            'Wairimu',
            'Swaleh',
            'Otieno',
            'Ramadhan',
            'Wasike',
            'Kariuki',
            'Omollo',
            'Mutua',
            'Bakari',
            'Muasya',
            'Abdi',
            'Muriithi',
            'Aden',
            'Said',
            'Ramadhan',
            'Omollo',
            'Barasa',
            'Kiprop',
            'Ramadhan',
            'Kariuki',
            'Bakari',
            'Mutiso',
            'Ndeti',
            'Mwalimu',
            'Farah',
            'Muli',
            'Ramadhan',
            'Ogola',
            'Ahmed',
            'Wanyonyi',
            'Kipkoech',
            'Mwangi',
            'Hussein',
            'Swaleh',
            'Hassan',
            'Mwalimu',
            'Hussein',
            'Wairimu',
            'Omollo',
            'Kitheka',
            'Gitau',
            'Lagat',
            'Wasike',
            'Aden',
            'Omar',
            'Wekesa',
            'Wekesa',
            'Juma',
            'Kiplagat',
            'Musyoka',
            'Warsame',
            'Wekesa',
            'Omar',
            'Kamau',
            'Kipkorir',
            'Kipkorir',
            'Juma',
            'Warsame',
            'Kipchoge',
            'Abdullahi',
            'Mwanzia',
            'Chepkwony',
            'Chepkwony',
            'Wanyonyi',
            'Mutiso',
            'Juma',
            'Muriithi',
            'Omondi',
            'Omar',
            'Odhiambo',
            'Odhiambo',
            'Wafula',
            'Ndeti',
            'Keter',
            'Swaleh',
            'Swaleh',
            'Kiplagat',
            'Mohamed',
            'Kiplagat',
            'Simiyu',
            'Kitheka',
            'Mwanzia',
            'Farah',
            'Mwangi',
            'Kariuki',
            'Njoroge',
            'Odhiambo',
            'Shikuku',
            'Njoroge',
            'Kiplagat',
            'Omondi',
            'Mshenga',
            'Abdi',
            'Shikuku',
            'Shikuku',
            'Warsame',
            'Shikuku',
            'Omollo',
            'Chelangat',
            'Hussein',
            'Salim',
            'Kipkoech',
            'Kipkoech',
            'Ogola',
            'Hassan',
            'Shikuku',
            'Kariuki',
            'Mwanzia',
            'Makokha',
            'Muli',
            'Warsame',
            'Kiprotich',
            'Wasike',
            'Kipkoech',
            'Muriithi',
            'Omondi',
            'Muasya',
            'Abdullahi',
            'Wanyonyi',
            'Ali',
            'Ndeti',
            'Odhiambo',
            'Kilonzo',
            'Wairimu',
            'Ochieng',
            'Wairimu',
            'Mutiso',
            'Hassan',
            'Ogola',
            'Mshenga',
            'Ndung’u',
            'Omar',
            'Omollo',
            'Farah',
            'Ogola',
            'Okoth',
            'Lagat',
            'Juma',
            'Mutiso',
            'Muli',
            'Juma',
            'Barasa',
            'Mwanzia',
            'Chelangat',
            'Wanjiru',
            'Wanyonyi',
            'Kiprop',
            'Wanyonyi',
            'Juma',
            'Muli',
            'Kiprop',
            'Odhiambo',
            'Onyango',
            'Omondi',
            'Bakari',
            'Nabwera',
            'Ogola',
            'Juma',
            'Abdullahi',
            'Warsame',
            'Ouma',
            'Kassim',
            'Aden',
            'Okoth',
            'Wasike',
            'Kioko',
            'Hassan',
            'Mwangi',
            'Mutiso',
            'Kipkorir',
            'Warsame',
            'Nabwera',
            'Kipkorir',
            'Wafula',
            'Otieno',
            'Otieno',
            'Omollo',
            'Kipkoech',
            'Kipkoech',
            'Kiplagat',
            'Mwalimu',
            'Mutiso',
            'Onyango',
            'Shikuku',
            'Barasa',
            'Kipchoge',
            'Wasike',
            'Mwalimu',
            'Otieno',
            'Bakari',
            'Ali',
            'Odhiambo',
            'Wanyonyi',
            'Keter',
            'Kiplagat',
            'Omollo',
            'Abdi',
            'Farah',
            'Juma',
            'Wairimu',
            'Nabwera',
            'Abdullahi',
            'Kiprotich',
            'Kitheka',
            'Makokha',
            'Ochieng',
            'Mutiso',
            'Swaleh',
            'Juma',
            'Chelangat',
            'Hassan',
            'Warsame',
            'Mutua',
            'Wasike',
            'Kamau',
            'Njoroge',
            'Kipkorir',
            'Njoroge',
            'Kiprotich',
            'Omollo',
            'Ouma',
            'Mohamed',
            'Warsame',
            'Njoroge',
            'Farah',
            'Muli',
            'Ochieng',
            'Keter',
            'Okoth',
            'Omollo',
            'Muli',
            'Owino',
            'Juma',
            'Abdullahi',
            'Abdullahi',
            'Mohamed',
            'Wafula',
            'Omar',
            'Ahmed',
            'Ndeti',
            'Gitau',
            'Mshenga',
            'Gitau',
            'Hassan',
            'Wanyonyi',
            'Kiprop',
            'Muli',
            'Wanjiru',
            'Kassim',
            'Kamau',
            'Muasya',
            'Ndeti',
            'Ochieng',
            'Kitheka',
            'Kipchoge',
            'Bakari',
            'Omollo',
            'Salim',
            'Abdi',
            'Keter',
            'Warsame',
            'Hussein',
            'Ochieng',
            'Hussein',
            'Wekesa',
            'Njoroge',
            'Ndung’u',
            'Ramadhan',
            'Bakari',
            'Njoroge',
            'Kiprop',
            'Omondi',
            'Mwanzia',
            'Simiyu',
            'Muasya',
            'Wafula',
            'Otieno',
            'Kassim',
            'Muli',
            'Ndung’u',
            'Juma',
            'Mutiso',
            'Ahmed',
            'Onyango',
            'Bakari',
            'Keter',
            'Muriithi',
            'Bakari',
            'Ramadhan',
            'Wairimu',
            'Kipkorir',
            'Wasike',
            'Ouma',
            'Otieno',
            'Kiplagat',
            'Ndung’u',
            'Ramadhan',
            'Omollo',
            'Juma',
            'Wekesa',
            'Chepkwony',
            'Macharia',
            'Bakari',
            'Kamau',
            'Otieno',
            'Otieno',
            'Ali',
            'Keter',
            'Ogola',
            'Muasya',
            'Kiprop',
            'Said',
            'Mwanzia',
            'Odhiambo',
            'Mwanzia',
            'Kitheka',
            'Bakari',
            'Omondi',
            'Kiprotich',
            'Ochieng',
            'Mwangi',
            'Wanyonyi',
            'Wafula',
            'Chelangat',
            'Ochieng',
            'Juma',
            'Kiplagat',
            'Onyango',
            'Ogola',
            'Kiprop',
            'Musyoka',
            'Swaleh',
            'Abdullahi',
            'Kiprop',
            'Said',
            'Wasike'
        ];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${firstName} ${lastName}`;
    };

    // Function to generate random phone numbers
    const generateRandomPhone = () => {
        const prefixes = [
            '0712', '0798', '0711', '0722', '0723', '0700', '0701', '0720', '0721',
            '0740', '0741', '0742', '0743', '0746', '0748',
            '0725', '0790', '0791', '0792', '0793', '0794', '0795', '0796', '0797'
        ];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}***${suffix}`;
    };

    // Generate 300+ random winners data with withdrawal status
    const generateWinners = () => {
        const winners = [];
        const usedNames = new Set();

        for (let i = 1; i <= 350; i++) {
            let name;
            // Ensure unique names
            do {
                name = generateRandomName();
            } while (usedNames.has(name));

            usedNames.add(name);

            winners.push({
                id: i,
                name: name,
                phone: generateRandomPhone(),
                amount: Math.floor(Math.random() * 2500) + 300, // Random amount between 300-2800
                status: Math.random() > 0.25 ? 'withdrawn' : 'pending' // 75% withdrawn, 25% pending
            });
        }
        return winners;
    };

    const [winners] = useState(generateWinners());

    useEffect(() => {
        // Check if user can activate account (won more than 800 KES)
        setCanActivate(currentUser.points >= 800 && !isActivated);
    }, [currentUser.points, isActivated]);

    useEffect(() => {
        // Carousel timer - change winner every 2 seconds with scroll animation
        const carouselTimer = setInterval(() => {
            // Animate scroll up
            Animated.timing(scrollY, {
                toValue: -60, // Height of one winner item
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                // Reset position and change winner
                scrollY.setValue(0);
                setCurrentWinnerIndex((prevIndex) => (prevIndex + 1) % winners.length);
            });
        }, 2000); // Changed to 2 seconds for smoother experience

        return () => clearInterval(carouselTimer);
    }, [winners.length, scrollY]);

    useEffect(() => {
        // Animate falling gifts if bonus spin hasn't been used
        if (!hasUsedBonusSpin) {
            const animateGifts = () => {
                // Reset positions for falling gifts
                giftAnimation1.setValue(-50);
                giftAnimation2.setValue(-50);
                giftAnimation3.setValue(-50);
                giftAnimation4.setValue(-50);
                giftAnimation5.setValue(-50);
                giftAnimation6.setValue(-50);
                giftAnimation7.setValue(-50);
                giftAnimation8.setValue(-50);

                // Reset positions for box confetti
                confetti1Animation.setValue(0);
                confetti2Animation.setValue(0);
                confetti3Animation.setValue(0);
                confetti4Animation.setValue(0);
                confetti5Animation.setValue(0);
                confetti6Animation.setValue(0);
                confetti7Animation.setValue(0);
                confetti8Animation.setValue(0);
                
                // Reset box opening animation
                boxOpenAnimation.setValue(0);
                
                // Reset overflow gifts and ribbons
                overflowGift1.setValue(0);
                overflowGift2.setValue(0);
                overflowGift3.setValue(0);
                overflowGift4.setValue(0);
                overflowGift5.setValue(0);
                overflowGift6.setValue(0);
                
                ribbon1Animation.setValue(0);
                ribbon2Animation.setValue(0);
                ribbon3Animation.setValue(0);
                ribbon4Animation.setValue(0);
                ribbon5Animation.setValue(0);

                // Animate gifts falling with different delays
                Animated.stagger(100, [
                    Animated.timing(giftAnimation1, {
                        toValue: 250,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(giftAnimation2, {
                        toValue: 250,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(giftAnimation3, {
                        toValue: 250,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(giftAnimation4, {
                        toValue: 250,
                        duration: 1400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(giftAnimation5, {
                        toValue: 250,
                        duration: 1600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(giftAnimation6, {
                        toValue: 250,
                        duration: 1300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(giftAnimation7, {
                        toValue: 250,
                        duration: 1700,
                        useNativeDriver: true,
                    }),
                    Animated.timing(giftAnimation8, {
                        toValue: 250,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ]).start();

                // Animate box opening
                Animated.timing(boxOpenAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();

                // Animate confetti popping out of the box
                Animated.stagger(80, [
                    Animated.timing(confetti1Animation, {
                        toValue: -50,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(confetti2Animation, {
                        toValue: -45,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                    Animated.timing(confetti3Animation, {
                        toValue: -55,
                        duration: 700,
                        useNativeDriver: true,
                    }),
                    Animated.timing(confetti4Animation, {
                        toValue: -48,
                        duration: 850,
                        useNativeDriver: true,
                    }),
                    Animated.timing(confetti5Animation, {
                        toValue: -52,
                        duration: 750,
                        useNativeDriver: true,
                    }),
                    Animated.timing(confetti6Animation, {
                        toValue: -46,
                        duration: 880,
                        useNativeDriver: true,
                    }),
                    Animated.timing(confetti7Animation, {
                        toValue: -54,
                        duration: 780,
                        useNativeDriver: true,
                    }),
                    Animated.timing(confetti8Animation, {
                        toValue: -49,
                        duration: 820,
                        useNativeDriver: true,
                    }),
                ]).start();

                // Animate overflowing gifts with different trajectories
                Animated.stagger(100, [
                    Animated.timing(overflowGift1, {
                        toValue: 1,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(overflowGift2, {
                        toValue: 1,
                        duration: 1600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(overflowGift3, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(overflowGift4, {
                        toValue: 1,
                        duration: 1700,
                        useNativeDriver: true,
                    }),
                    Animated.timing(overflowGift5, {
                        toValue: 1,
                        duration: 1900,
                        useNativeDriver: true,
                    }),
                    Animated.timing(overflowGift6, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ]).start();

                // Animate colorful ribbons flowing out
                Animated.stagger(80, [
                    Animated.timing(ribbon1Animation, {
                        toValue: 1,
                        duration: 2200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(ribbon2Animation, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(ribbon3Animation, {
                        toValue: 1,
                        duration: 2400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(ribbon4Animation, {
                        toValue: 1,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(ribbon5Animation, {
                        toValue: 1,
                        duration: 2100,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    // Restart animation after a delay
                    setTimeout(animateGifts, 400);
                });
            };

            animateGifts();
        }
    }, [hasUsedBonusSpin, giftAnimation1, giftAnimation2, giftAnimation3, giftAnimation4, giftAnimation5, giftAnimation6, giftAnimation7, giftAnimation8, confetti1Animation, confetti2Animation, confetti3Animation, confetti4Animation, confetti5Animation, confetti6Animation, confetti7Animation, confetti8Animation, boxOpenAnimation, overflowGift1, overflowGift2, overflowGift3, overflowGift4, overflowGift5, overflowGift6, ribbon1Animation, ribbon2Animation, ribbon3Animation, ribbon4Animation, ribbon5Animation]);

    const handleActivateAccount = async () => {
        Alert.alert(
            'Activate Account',
            'Congratulations! You have won more than KES 800. Activate your account to unlock premium features.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Activate',
                    onPress: async () => {
                        await AuthService.activateUser(currentUser.id);
                        setIsActivated(true);
                        setCanActivate(false);
                        Alert.alert('Success', 'Your account has been activated!');
                    },
                },
            ]
        );
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AuthService.logout();
                        onLogout();
                    },
                },
            ]
        );
    };

    const handleWallet = () => {
        setShowWithdrawScreen(true);
    };

    const handleReferral = () => {
        setShowReferralScreen(true);
    };

    const handleClaimBonus = () => {
        Alert.alert(
            'Claim Bonus',
            'Daily bonus available! Complete tasks and challenges to earn bonus rewards.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'View Tasks',
                    onPress: () => {
                        Alert.alert('Coming Soon', 'Bonus tasks and challenges feature will be available soon!');
                    },
                },
            ]
        );
    };

    const handleWithdrawReferralEarnings = () => {
        const earnings = referralClicks * 100;
        if (earnings === 0) {
            Alert.alert('No Earnings', 'You have no referral earnings to withdraw. Start referring friends to earn KES 100 per referral!');
            return;
        }
        
        Alert.alert(
            'Withdraw Referral Earnings',
            `You are about to withdraw KES ${earnings} from your referral earnings. This amount will be added to your referral bonus balance.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Withdraw',
                    onPress: async () => {
                        // Add earnings to referral bonus balance
                        const newBonusBalance = (currentUser.bonusBalance || 0) + earnings;
                        const updatedUser = { ...currentUser, bonusBalance: newBonusBalance };
                        setCurrentUser(updatedUser);
                        // Optionally persist bonusBalance to storage
                        await AuthService.updateUserBonusBalance(currentUser.id, newBonusBalance);
                        // Reset referral clicks since earnings have been withdrawn
                        setReferralClicks(0);
                        Alert.alert('Success', `KES ${earnings} has been added to your referral bonus balance!`);
                    },
                },
            ]
        );
    };

    const handleWithdrawAccountBalance = () => {
        if (currentUser.points === 0) {
            Alert.alert('No Balance', 'You have no account balance to withdraw. Win some games or refer friends to earn money!');
            return;
        }

        // Check if account needs activation for large amounts
        if (currentUser.points >= 800 && !isActivated) {
            Alert.alert(
                'Account Activation Required',
                `To withdraw your account balance of KES ${currentUser.points}, you need to activate your account first.\n\nAccount activation helps us verify your identity and ensures secure transactions.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Activate Account',
                        onPress: () => setShowActivateScreen(true),
                    },
                ]
            );
            return;
        }

        // Show withdraw screen for smaller amounts or activated accounts
        setShowWithdrawScreen(true);
    };

    const showActivationInstructions = () => {
        const instructions = `📋 ACCOUNT ACTIVATION INSTRUCTIONS

🔹 Step 1: Verify Your Phone Number
   • Ensure your phone number is correct
   • You'll receive an SMS verification code

🔹 Step 2: Provide Valid ID
   • Upload a clear photo of your National ID
   • Or valid passport/driving license

🔹 Step 3: Bank Account Details
   • Provide your bank account number
   • Bank name and branch details
   • Account must be in your name

🔹 Step 4: Win Minimum Amount
   • Win at least KES 800 in games
   • This unlocks activation eligibility

✅ CURRENT STATUS:
   • Account Balance: KES ${currentUser.points}
   • Activation Eligible: ${currentUser.points >= 800 ? 'YES ✅' : 'NO ❌'}
   • Required Amount: KES 800

💡 TIP: Play more games to reach KES 800 and unlock account activation!`;

        Alert.alert(
            'How to Activate Your Account',
            instructions,
            [
                { text: 'Got It', style: 'default' },
                {
                    text: currentUser.points >= 800 ? 'Activate Now' : 'Play Games',
                    onPress: () => {
                        if (currentUser.points >= 800) {
                            handleActivateAccount();
                        } else {
                            Alert.alert(
                                'Keep Playing!',
                                `You need KES ${800 - currentUser.points} more to unlock activation. Keep spinning the wheel to win!`
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleSpinToWin = () => {
        setShowSpinModal(true);
    };

    const handleModalWin = async (pointsChange: number) => {
        try {
            console.log('=== HANDLE MODAL WIN ===', { pointsChange, currentUserPoints: currentUser.points });
            
            const newPoints = currentUser.points + pointsChange;
            
            // Update user data in storage
            await AuthService.updateUserPoints(currentUser.id, newPoints);
            await AuthService.updateUserSpinStatus(currentUser.id, true);
            
            // Update local state safely
            setCurrentUser(prevUser => ({ 
                ...prevUser, 
                points: newPoints, 
                hasUsedFreeSpin: true 
            }));
            setHasUsedBonusSpin(true);
            
            // Show simple alert instead of complex notification to avoid render issues
            setTimeout(() => {
                Alert.alert(
                    '🎉 Congratulations!',
                    `You won KES ${pointsChange}! Your new balance is KES ${newPoints}.`,
                    [{ text: 'OK' }]
                );
            }, 500);
            
            // Close modal after a delay
            setTimeout(() => {
                try {
                    setShowSpinModal(false);
                } catch (error) {
                    console.error('Error closing spin modal:', error);
                }
            }, 1000);
            
            console.log('✅ Modal win handled successfully');
        } catch (error) {
            console.error('❌ Error in handleModalWin:', error);
            Alert.alert(
                'Error',
                'Failed to process your win. Please try again.',
                [{ text: 'OK' }]
            );
            try {
                setShowSpinModal(false);
            } catch (modalError) {
                console.error('Error closing modal after error:', modalError);
            }
        }
    };

    const handleHome = () => {
        // User is already on home screen - no action needed
    };

    const handleContactUs = () => {
        setShowContactUsScreen(true);
    };

    const handleTestNotifications = () => {
        // First show an immediate toast to test basic functionality
        notifications.showToast({
            message: 'Testing notifications...',
            type: 'info',
            duration: 3000
        });

        // Then show the options
        notifications.showAlert(
            'Test Notifications',
            'Choose a notification type to test:',
            [
                {
                    text: 'Hourly Notification Test',
                    onPress: () => {
                        const { HourlyNotificationScheduler } = require('../utils/HourlyNotificationScheduler');
                        const scheduler = HourlyNotificationScheduler.getInstance();
                        scheduler.triggerTestNotification();
                    }
                },
                {
                    text: 'Payment Success',
                    onPress: () => notifications.showPaymentSuccess(250, '5892851')
                },
                {
                    text: 'Game Win',
                    onPress: () => notifications.showGameWin(150)
                },
                {
                    text: 'Account Activated',
                    onPress: () => notifications.showAccountActivated()
                },
                {
                    text: 'Referral Reward',
                    onPress: () => notifications.showReferralReward(50)
                },
                {
                    text: 'Toast Success',
                    onPress: () => notifications.showToast({
                        message: 'This is a success toast message!',
                        type: 'success',
                        duration: 3000
                    })
                },
                {
                    text: 'Toast Error',
                    onPress: () => notifications.showToast({
                        message: 'This is an error toast message!',
                        type: 'error',
                        duration: 3000
                    })
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const menuOptions = [
        {
            id: 'home',
            label: 'Home',
            icon: '🏠',
            onPress: handleHome,
        },
        {
            id: 'wallet',
            label: 'Wallet',
            icon: '💰',
            onPress: handleWallet,
        },
        {
            id: 'referral',
            label: 'Referral & Earn',
            icon: '🎁',
            onPress: handleReferral,
        },
        {
            id: 'contact',
            label: 'Contact Us',
            icon: '📞',
            onPress: handleContactUs,
        },
        {
            id: 'notifications',
            label: 'Test Notifications',
            icon: '🔔',
            onPress: handleTestNotifications,
        },
        {
            id: 'logout',
            label: 'Logout',
            icon: '🚪',
            onPress: handleLogout,
            color: '#ff4444',
        },
    ];
    const handleWin = async (pointsChange: number) => {
        const newPoints = currentUser.points + pointsChange;

        // Update user points in storage
        await AuthService.updateUserPoints(currentUser.id, newPoints);

        // Update local state
        setCurrentUser({ ...currentUser, points: newPoints });
    };

    const maskPhoneNumber = (phone: string) => {
        if (phone.length < 8) return phone;
        const start = phone.substring(0, 4);
        const end = phone.substring(phone.length - 3);
        return `${start}***${end}`;
    };

    const getStatusText = (status: string, amount: number) => {
        return status === 'withdrawn' ? `KES ${amount} withdrawn` : `KES ${amount} pending`;
    };

    const getStatusColor = (status: string) => {
        return status === 'withdrawn' ? '#4CAF50' : '#FF9800';
    };

    const handleWithdraw = async (phoneNumber: string, amount: number) => {
        try {
            // Deduct withdrawal amount and processing fee from user balance
            const processingFee = 25;
            const totalDeduction = amount + processingFee;
            const newPoints = currentUser.points - totalDeduction;
            
            await AuthService.updateUserPoints(currentUser.id, newPoints);
            setCurrentUser({ ...currentUser, points: newPoints });
            
            setShowWithdrawScreen(false);
            
            Alert.alert(
                'Withdrawal Successful! 🎉',
                `KES ${amount} has been sent to ${phoneNumber}\n\nProcessing fee: KES ${processingFee}\nRemaining balance: KES ${newPoints}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
        }
    };

    const handleGoBackFromWithdraw = () => {
        setShowWithdrawScreen(false);
    };

    const handleShowActivation = () => {
        setShowWithdrawScreen(false);
        setShowActivateScreen(true);
    };

    const handleGoBackFromActivation = () => {
        setShowActivateScreen(false);
        setShowWithdrawScreen(true);
    };

    const handleActivationComplete = async () => {
        // Keep user in pending activation status instead of fully activating
        const updatedUser = { ...currentUser, pendingActivation: true };
        setCurrentUser(updatedUser);
        setIsPendingActivation(true);
        setShowActivateScreen(false);
        setShowWithdrawScreen(true);
        
        // Show account activated notification
        notifications.showAccountActivated();
    };

    const handlePendingActivation = async () => {
        // Update user to pending activation status
        await AuthService.setPendingActivation(currentUser.id);
        const updatedUser = { ...currentUser, pendingActivation: true };
        setCurrentUser(updatedUser);
        setIsPendingActivation(true);
        setShowActivateScreen(false);
        
        Alert.alert(
            'Validation Complete! ✅',
            'Your transaction is being validated. You will receive a notification shortly once verification is complete.',
            [{ text: 'OK' }]
        );
    };

    const handleShowReferral = () => {
        setShowReferralScreen(true);
    };

    const handleGoBackFromReferral = () => {
        setShowReferralScreen(false);
    };

    // Show withdraw screen if active
    if (showWithdrawScreen) {
        return (
            <WithdrawScreen
                userBalance={currentUser.points}
                userPhoneNumber={currentUser.phoneNumber}
                isAccountActivated={isActivated}
                onGoBack={handleGoBackFromWithdraw}
                onWithdraw={handleWithdraw}
                onShowActivation={handleShowActivation}
            />
        );
    }

    // Show activation screen if active
    if (showActivateScreen) {
        return (
            <ActivateAccountScreen
                userPhoneNumber={currentUser.phoneNumber}
                userPoints={currentUser.points}
                onGoBack={handleGoBackFromActivation}
                onActivationComplete={handleActivationComplete}
                onPendingActivation={handlePendingActivation}
            />
        );
    }

    // Show referral screen if active
    if (showReferralScreen) {
        return (
            <ReferralScreen
                user={currentUser}
                onGoBack={handleGoBackFromReferral}
            />
        );
    }

    // Show contact us screen if active
    if (showContactUsScreen) {
        return (
            <ContactUsScreen
                onClose={() => setShowContactUsScreen(false)}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu options={menuOptions} user={currentUser} />
                <View style={styles.headerText}>
                    <Text style={styles.appTitle}>PataPesa</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Winners Carousel Section */}
                <View style={styles.section}>
                    <View style={styles.winnersContainer}>
                        <View style={styles.winnerCarousel}>
                            <Animated.View
                                style={[
                                    styles.winnerItem,
                                    {
                                        transform: [{ translateY: scrollY }],
                                    },
                                ]}
                            >
                                <View style={styles.winnerInfo}>
                                    <Text style={styles.winnerName}>{winners[currentWinnerIndex].name}</Text>
                                    <Text style={styles.winnerPhone}>{winners[currentWinnerIndex].phone}</Text>
                                </View>
                                <View style={styles.winnerAmountContainer}>
                                    <View style={styles.amountButton}>
                                        <Text style={[styles.winnerAmount, { color: '#064e3b' }]}>
                                            {getStatusText(winners[currentWinnerIndex].status, winners[currentWinnerIndex].amount)}
                                        </Text>
                                    </View>
                                    <Text style={styles.winnerStatus}>
                                        {winners[currentWinnerIndex].status === 'withdrawn' ? '✅ Completed' : '⏳ Processing'}
                                    </Text>
                                </View>
                            </Animated.View>
                        </View>
                    </View>
                </View>

                {/* Balance Card */}
                <View style={styles.section}>
                    <View style={styles.balanceCard}>
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceIconText}>💰</Text>
                            <Text style={styles.balanceTitle}>Account Balance</Text>
                        </View>
                        <View style={styles.balanceAmountContainer}>
                            <Text style={styles.balanceAmount}>KES {currentUser.points}</Text>
                            {isPendingActivation && (
                                <View style={styles.pendingActivationBadge}>
                                    <Text style={styles.pendingActivationText}>⏳ Pending Activation</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.balanceDivider} />

                        {/* Referral Section */}
                        <View style={styles.referralSection}>
                            <View style={styles.referralInfo}>
                                <View style={styles.referralLeftSection}>
                                    <View style={styles.referralTopRow}>
                                        <Text style={styles.phoneIcon}>📱</Text>
                                        <Text style={styles.referralCount}>{referralClicks}</Text>
                                    </View>
                                    <Text style={styles.referralLabel}>Total Clicks</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.earningsButton} onPress={handleWithdrawReferralEarnings}>
                                <Text style={styles.earningsLabel}>Referral Earnings</Text>
                                <Text style={styles.earningsAmount}>💵 KES {referralClicks * 100}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Account Balance Withdraw Section */}
                        <View style={styles.balanceDivider} />
                        <View style={styles.withdrawSection}>
                            <TouchableOpacity style={styles.withdrawAccountButton} onPress={handleWithdrawAccountBalance}>
                                <View style={styles.withdrawButtonContent}>
                                    <View style={styles.withdrawButtonLeft}>
                                        <Text style={styles.withdrawIcon}>🏦</Text>
                                        <View>
                                            <Text style={styles.withdrawButtonTitle}>Withdraw Account Balance</Text>
                                            <Text style={styles.withdrawButtonSubtitle}>KES {currentUser.points} available</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.withdrawArrow}>→</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Lucky Box Bonus Spin Section */}
                {!hasUsedBonusSpin && (
                    <View style={styles.section}>
                        <View style={styles.luckyBoxCard}>
                            <View style={styles.giftDropContainer}>
                                {/* Falling confetti from top */}
                                <Animated.View
                                    style={[
                                        styles.fallingGift,
                                        styles.giftPosition1,
                                        { transform: [{ translateY: giftAnimation1 }] }
                                    ]}
                                >
                                    <Text style={styles.giftEmoji}>💵</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.fallingGift,
                                        styles.giftPosition2,
                                        { transform: [{ translateY: giftAnimation2 }] }
                                    ]}
                                >
                                    <Text style={styles.giftEmoji}>💰</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.fallingGift,
                                        styles.giftPosition3,
                                        { transform: [{ translateY: giftAnimation3 }] }
                                    ]}
                                >
                                    <Text style={styles.giftEmoji}>✨</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.fallingGift,
                                        styles.giftPosition4,
                                        { transform: [{ translateY: giftAnimation4 }] }
                                    ]}
                                >
                                    <Text style={styles.giftEmoji}>🎉</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.fallingGift,
                                        styles.giftPosition5,
                                        { transform: [{ translateY: giftAnimation5 }] }
                                    ]}
                                >
                                    <Text style={styles.giftEmoji}>💵</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.fallingGift,
                                        styles.giftPosition6,
                                        { transform: [{ translateY: giftAnimation6 }] }
                                    ]}
                                >
                                    <Text style={styles.giftEmoji}>♦️</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.fallingGift,
                                        styles.giftPosition7,
                                        { transform: [{ translateY: giftAnimation7 }] }
                                    ]}
                                >
                                    <Text style={styles.giftEmoji}>💵</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.fallingGift,
                                        styles.giftPosition8,
                                        { transform: [{ translateY: giftAnimation8 }] }
                                    ]}
                                >
                                    <Text style={styles.giftEmoji}>💶</Text>
                                </Animated.View>
                                
                                {/* Overflowing Gifts from the Box */}
                                <Animated.View
                                    style={[
                                        styles.overflowGift,
                                        styles.overflowPosition1,
                                        {
                                            transform: [
                                                {
                                                    translateY: overflowGift1.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -60],
                                                    }),
                                                },
                                                {
                                                    translateX: overflowGift1.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -30],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={styles.overflowGiftEmoji}>🎁</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.overflowGift,
                                        styles.overflowPosition2,
                                        {
                                            transform: [
                                                {
                                                    translateY: overflowGift2.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -55],
                                                    }),
                                                },
                                                {
                                                    translateX: overflowGift2.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 25],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={styles.overflowGiftEmoji}>🎉</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.overflowGift,
                                        styles.overflowPosition3,
                                        {
                                            transform: [
                                                {
                                                    translateY: overflowGift3.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -70],
                                                    }),
                                                },
                                                {
                                                    translateX: overflowGift3.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 40],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={styles.overflowGiftEmoji}>💎</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.overflowGift,
                                        styles.overflowPosition4,
                                        {
                                            transform: [
                                                {
                                                    translateY: overflowGift4.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -65],
                                                    }),
                                                },
                                                {
                                                    translateX: overflowGift4.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -20],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={styles.overflowGiftEmoji}>💰</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.overflowGift,
                                        styles.overflowPosition5,
                                        {
                                            transform: [
                                                {
                                                    translateY: overflowGift5.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -50],
                                                    }),
                                                },
                                                {
                                                    translateX: overflowGift5.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 35],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={styles.overflowGiftEmoji}>🎊</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.overflowGift,
                                        styles.overflowPosition6,
                                        {
                                            transform: [
                                                {
                                                    translateY: overflowGift6.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -45],
                                                    }),
                                                },
                                                {
                                                    translateX: overflowGift6.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -35],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={styles.overflowGiftEmoji}>✨</Text>
                                </Animated.View>
                                
                                {/* Colorful Ribbons flowing out */}
                                <Animated.View
                                    style={[
                                        styles.ribbon,
                                        styles.ribbonPosition1,
                                        {
                                            transform: [
                                                {
                                                    translateY: ribbon1Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -80],
                                                    }),
                                                },
                                                {
                                                    translateX: ribbon1Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -45],
                                                    }),
                                                },
                                                {
                                                    rotate: ribbon1Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '180deg'],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={styles.ribbonEmoji}>🎀</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.ribbon,
                                        styles.ribbonPosition2,
                                        {
                                            transform: [
                                                {
                                                    translateY: ribbon2Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -75],
                                                    }),
                                                },
                                                {
                                                    translateX: ribbon2Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 50],
                                                    }),
                                                },
                                                {
                                                    rotate: ribbon2Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '-160deg'],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={[styles.ribbonEmoji, { color: '#FF6B9D' }]}>🎗️</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.ribbon,
                                        styles.ribbonPosition3,
                                        {
                                            transform: [
                                                {
                                                    translateY: ribbon3Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -90],
                                                    }),
                                                },
                                                {
                                                    translateX: ribbon3Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 20],
                                                    }),
                                                },
                                                {
                                                    rotate: ribbon3Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '270deg'],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={[styles.ribbonEmoji, { color: '#4ECDC4' }]}>🎀</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.ribbon,
                                        styles.ribbonPosition4,
                                        {
                                            transform: [
                                                {
                                                    translateY: ribbon4Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -65],
                                                    }),
                                                },
                                                {
                                                    translateX: ribbon4Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -25],
                                                    }),
                                                },
                                                {
                                                    rotate: ribbon4Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '120deg'],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={[styles.ribbonEmoji, { color: '#FFE66D' }]}>🎗️</Text>
                                </Animated.View>
                                
                                <Animated.View
                                    style={[
                                        styles.ribbon,
                                        styles.ribbonPosition5,
                                        {
                                            transform: [
                                                {
                                                    translateY: ribbon5Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -85],
                                                    }),
                                                },
                                                {
                                                    translateX: ribbon5Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 45],
                                                    }),
                                                },
                                                {
                                                    rotate: ribbon5Animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '-90deg'],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <Text style={[styles.ribbonEmoji, { color: '#A8E6CF' }]}>🎀</Text>
                                </Animated.View>
                                
                                {/* Confetti coming out of the box */}
                                <Animated.View
                                    style={[
                                        styles.boxFlower,
                                        styles.boxFlowerPosition1,
                                        { transform: [{ translateY: confetti1Animation }] }
                                    ]}
                                >
                                    <Text style={styles.boxFlowerEmoji}>💵</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.boxFlower,
                                        styles.boxFlowerPosition2,
                                        { transform: [{ translateY: confetti2Animation }] }
                                    ]}
                                >
                                    <Text style={styles.boxFlowerEmoji}>♦️</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.boxFlower,
                                        styles.boxFlowerPosition3,
                                        { transform: [{ translateY: confetti3Animation }] }
                                    ]}
                                >
                                    <Text style={styles.boxFlowerEmoji}>✨</Text>
                                </Animated.View>
                                <Animated.View
                                    style={[
                                        styles.boxFlower,
                                        styles.boxFlowerPosition4,
                                        { transform: [{ translateY: confetti4Animation }] }
                                    ]}
                                >
                                    <Text style={styles.boxFlowerEmoji}>💶</Text>
                                </Animated.View>
                            </View>
                            
                            <View style={styles.luckyBoxContent}>
                                <Text style={styles.luckyBoxIcon}>🎁</Text>
                                <Text style={styles.luckyBoxWelcome}>Welcome to Bonus Spin!</Text>
                                <Text style={styles.bonusDescription}>
                                    Get your FREE welcome spin!{'\n'}
                                    Win up to KES 1000!
                                </Text>
                                
                                <TouchableOpacity 
                                    style={styles.spinToWinButton} 
                                    onPress={handleSpinToWin}
                                >
                                    <Text style={styles.spinToWinText}>🎰 Spin to Win 🎰</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Claim Bonus Button */}
                <View style={styles.section}>
                    <TouchableOpacity 
                        style={styles.claimBonusButton} 
                        onPress={handleClaimBonus}
                    >
                        <Text style={styles.claimBonusButtonText}>$ Claim Bonus to Start</Text>
                    </TouchableOpacity>
                </View>

                {/* Activate Account Section - Shows after bonus spin is used */}
                {hasUsedBonusSpin && (
                    <View style={styles.section}>
                        <View style={styles.activateCard}>
                            <Text style={styles.activateCardIcon}>🔓</Text>
                            <Text style={styles.activateCardTitle}>Unlock More Features!</Text>
                            <Text style={styles.activateCardDescription}>
                                Activate your account to withdraw your earnings{'\n'}
                                and unlock premium features.
                            </Text>
                            
                            <TouchableOpacity 
                                style={styles.activateAccountButton} 
                                onPress={handleWithdrawAccountBalance}
                            >
                                <Text style={styles.activateAccountButtonText}>🏦 Activate Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Spin Wheel Modal */}
            <Modal
                visible={showSpinModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowSpinModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        onPress={() => setShowSpinModal(false)}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.wheelContainer}>
                        <SpinWheel
                            onWin={handleModalWin}
                            userPoints={currentUser.points}
                            hasUsedSpin={currentUser.hasUsedFreeSpin || false}
                        />
                    </View>
                    
            
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerText: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgba(91, 175, 120, 1)',
    },
    welcomeText: {
        fontSize: 16,
        color: '#666',
    },
    usernameText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    winnersContainer: {
        backgroundColor: 'rgba(91, 175, 120, 1)',
        borderRadius: 8,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    referralBonusContainer: {
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e6f7ee',
        borderRadius: 8,
        alignItems: 'center',
    },
    referralBonusLabel: {
        fontSize: 15,
        color: '#064e3b',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    referralBonusAmount: {
        fontSize: 18,
        color: '#1a7f37',
        fontWeight: 'bold',
    },
    winnerCarousel: {
        minHeight: 60,
        overflow: 'hidden',
    },
    winnerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 0,
    },
    winnerInfo: {
        flex: 1,
    },
    winnerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 2,
    },
    winnerPhone: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    winnerAmountContainer: {
        alignItems: 'flex-end',
    },
    amountButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 2,
    },
    winnerAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 1,
    },
    winnerStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    balanceCard: {
        backgroundColor: 'rgba(91, 175, 120, 1)',
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    balanceIconText: {
        fontSize: 18,
        marginRight: 10,
        color: 'white',
    },
    balanceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
    },
    balanceDivider: {
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginVertical: 10,
    },
    balanceInfo: {
        alignItems: 'center',
        marginBottom: 10,
    },
    balanceAmountContainer: {
        marginBottom: 10,
        alignItems: 'flex-start',
        borderRadius: 20
    },
    balanceLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    balanceAmount: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    pendingActivationBadge: {
        backgroundColor: 'rgba(255, 193, 7, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
        marginTop: 8,
        alignSelf: 'center',
    },
    pendingActivationText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#856404',
        textAlign: 'center',
    },
    balanceStatus: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    activateButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 5,
    },
    activateButtonText: {
        color: '#064e3b',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    gameTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 10,
    },
    gameDescription: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
        lineHeight: 24,
    },
    referralSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        marginBottom: 10,
    },
    referralInfo: {
        flex: 1,
    },
    referralLeftSection: {
        alignItems: 'flex-start',
    },
    referralTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    referralIconContainer: {
        marginRight: 12,
    },
    phoneIcon: {
        fontSize: 20,
        color: 'white',
        marginRight: 8,
    },
    referralDetails: {
        flex: 1,
    },
    referralLabel: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 2,
    },
    referralCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    earningsInfo: {
        alignItems: 'flex-end',
    },
    earningsButton: {
        alignItems: 'flex-end',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    earningsLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 2,
    },
    earningsAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 2,
    },
    withdrawText: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.9)',
        fontStyle: 'italic',
    },
    withdrawSection: {
        marginTop: 10,
    },
    withdrawAccountButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    withdrawButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    withdrawButtonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    withdrawIcon: {
        fontSize: 24,
        marginRight: 12,
        color: 'white',
    },
    withdrawButtonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 2,
    },
    withdrawButtonSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    withdrawArrow: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 'bold',
    },
    // Lucky Box Card Styles
    luckyBoxCard: {
        backgroundColor: 'rgba(91, 175, 120, 1)',
        borderRadius: 15,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    giftDropContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        zIndex: 1,
    },
    fallingGift: {
        position: 'absolute',
        top: -50,
    },
    giftDelay1: {
        left: '30%',
    },
    giftDelay2: {
        right: '20%',
    },
    giftEmoji: {
        fontSize: 24,
        textAlign: 'center',
    },
    luckyBoxContent: {
        alignItems: 'center',
        zIndex: 2,
        position: 'relative',
    },
    luckyBoxIcon: {
        fontSize: 48,
        marginBottom: 15,
        textAlign: 'center',
    },
    luckyBoxWelcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    bonusDescription: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    spinToWinButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    spinToWinText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    // Activate Card Styles
    activateCard: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    activateCardIcon: {
        fontSize: 48,
        marginBottom: 15,
        textAlign: 'center',
    },
    activateCardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    activateCardDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    activateAccountButton: {
        backgroundColor: '#FFC107',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    activateAccountButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
    wheelContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    modalDescription: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    modalSpinButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalSpinButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    // Gift position styles for different horizontal positions
    giftPosition1: {
        left: '5%',
    },
    giftPosition2: {
        left: '15%',
    },
    giftPosition3: {
        left: '25%',
    },
    giftPosition4: {
        left: '35%',
    },
    giftPosition5: {
        left: '45%',
    },
    giftPosition6: {
        left: '55%',
    },
    giftPosition7: {
        left: '65%',
    },
    giftPosition8: {
        left: '75%',
    },
    // Box flower styles
    boxFlower: {
        position: 'absolute',
        zIndex: 3,
        bottom: 120, // Position near the gift box
    },
    boxFlowerPosition1: {
        left: '40%',
    },
    boxFlowerPosition2: {
        left: '50%',
    },
    boxFlowerPosition3: {
        left: '60%',
    },
    boxFlowerPosition4: {
        left: '45%',
    },
    boxFlowerEmoji: {
        fontSize: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    // Gift Box Animation Styles
    giftBoxContainer: {
        position: 'absolute',
        bottom: 140,
        left: '47%',
        zIndex: 4,
    },
    giftBoxBase: {
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
    },
    giftBoxBaseEmoji: {
        fontSize: 32,
        textAlign: 'center',
    },
    giftBoxLid: {
        position: 'absolute',
        bottom: 25,
        left: -2,
        zIndex: 2,
    },
    giftBoxLidEmoji: {
        fontSize: 28,
        textAlign: 'center',
    },
    // Overflow Gift Styles
    overflowGift: {
        position: 'absolute',
        zIndex: 3,
        bottom: 140,
    },
    overflowPosition1: {
        left: '38%',
    },
    overflowPosition2: {
        left: '45%',
    },
    overflowPosition3: {
        left: '52%',
    },
    overflowPosition4: {
        left: '42%',
    },
    overflowPosition5: {
        left: '48%',
    },
    overflowPosition6: {
        left: '40%',
    },
    overflowGiftEmoji: {
        fontSize: 18,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    // Ribbon Styles
    ribbon: {
        position: 'absolute',
        zIndex: 3,
        bottom: 140,
    },
    ribbonPosition1: {
        left: '35%',
    },
    ribbonPosition2: {
        left: '55%',
    },
    ribbonPosition3: {
        left: '47%',
    },
    ribbonPosition4: {
        left: '40%',
    },
    ribbonPosition5: {
        left: '50%',
    },
    ribbonEmoji: {
        fontSize: 16,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
    },
    // Claim Bonus Button Styles
    claimBonusButton: {
        marginBottom: 20,
        backgroundColor: 'rgba(91, 175, 120, 1)',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    claimBonusButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});
