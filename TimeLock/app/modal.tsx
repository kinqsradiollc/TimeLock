import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { modalStyles as styles } from '@/styles/screens/modal.styles';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is a modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.linkText}>Go to home screen</Text>
      </Link>
    </View>
  );
}
