import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'screens/customer_home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // In production, initialize Firebase with default options:
  // await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const UstadOnlineApp());
}

class UstadOnlineApp extends StatelessWidget {
  const UstadOnlineApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ustad Online',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF059669),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF10B981),
          secondary: Color(0xFFF59E0B),
          surface: Color(0xFF1E293B),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0F172A),
          elevation: 0,
          centerTitle: true,
          titleTextStyle: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      home: const CustomerHomeScreen(),
    );
  }
}
