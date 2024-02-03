import {SPrinter} from '@makgabri/react-native-sunmi-printer';
import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

const App = () => {
  const [customMessage, setCustomMessage] = useState('');
  const [logs, setLogs] = useState(['first log', 'second log']);
  const scrollViewRef = useRef();

  const log = logMessage => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${logMessage}`;
    setLogs(prevLogs => [...prevLogs, logEntry]);
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  const handleCustomMessagePrint = async () => {
    if (!customMessage.length) {
      log('No custom message found to print.');
      return;
    }

    try {
      await SPrinter.connect();
      log('Connected to SUNMI Printing device.');
    } catch (error) {
      log(`Failed to connect to a SUNMI printing device. \n> ${error}`);
    }

    try {
      await SPrinter.printText(customMessage);
      log('Sending custom message to print...');
    } catch (error) {
      log(`Error in sending a test print. \n> ${error}`);
    }

    try {
      await SPrinter.disconnect();
      log('Disconnecting from SUNMI Printing device.');
    } catch (error) {
      log(`Error in disconnecting from device. \n> ${error}`);
    }
  };

  const handleTestMessagePrint = async () => {
    try {
      await SPrinter.connect();
      log('Connected to SUNMI Printing device.');
    } catch (error) {
      log(`Failed to connect to a SUNMI printing device. \n> ${error}`);
    }

    try {
      await SPrinter.testPrint();
      log('Sending a test print...');
    } catch (error) {
      log(`Error in sending a test print. \n> ${error}`);
    }

    try {
      await SPrinter.disconnect();
      log('Disconnecting from SUNMI Printing device.');
    } catch (error) {
      log(`Error in disconnecting from device. \n> ${error}`);
    }
  };

  const handleGetPrinterInfo = async () => {
    try {
      await SPrinter.connect();
      const data = await SPrinter.getPrinterSpecs();
      //{DeviceModel: 'T2-GPIOINT\n', PrintPaper: '80mm', PrinterVersion: '1.05\n', SerialNo: 'XXXXXXXXXXXXXXXXXXXX'}

      Alert.alert(
        'Device Info',
        `
        Model: ${data.DeviceModel}\n
        Print Paper: ${data.PrintPaper}\n
        Printer Version: ${data.PrinterVersion}\n
        Serial Number: ${data.SerialNo}
        `,
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );

      await SPrinter.disconnect();
    } catch (error) {
      log(`Failed to get printer info. \n> ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type the message to print"
        placeholderTextColor="gray"
        onChangeText={val => setCustomMessage(val)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCustomMessagePrint}>
          <Text style={styles.buttonText}>Print Custom Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTestMessagePrint}>
          <Text style={styles.buttonText}>Print Test Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGetPrinterInfo}>
          <Text style={styles.buttonText}>Get Printer Info</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.logWindowLabel}>Log Window</Text>
      <ScrollView
        ref={scrollViewRef}
        style={styles.logsContainer}
        contentContainerStyle={styles.logsContent}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {`> ${log}`}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'limegreen',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    color: 'black',
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center', // Align text in the center horizontally
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logsContainer: {
    width: '80%',
    maxHeight: 250,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
  },
  logsContent: {
    paddingBottom: 20, // Extra padding to ensure the last log is visible
  },
  logText: {
    color: 'black',
    fontFamily: 'monospace',
  },
  logWindowLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
});

export default App;
