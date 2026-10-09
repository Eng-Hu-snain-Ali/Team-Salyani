import 'package:flutter/material.dart';
import '../models/booking_model.dart';

class CustomerHomeScreen extends StatefulWidget {
  const CustomerHomeScreen({super.key});

  @override
  State<CustomerHomeScreen> createState() => _CustomerHomeScreenState();
}

class _CustomerHomeScreenState extends State<CustomerHomeScreen> {
  String _selectedCategory = 'electrician';
  String _selectedLocation = 'D-Ground Commercial Market, Peoples Colony #1';

  final List<Map<String, dynamic>> _categories = [
    {'id': 'electrician', 'name': 'Electrician', 'urdu': 'الیکٹریشن', 'icon': Icons.bolt, 'color': Colors.amber},
    {'id': 'plumber', 'name': 'Plumber', 'urdu': 'پلمبر', 'icon': Icons.build, 'color': Colors.blue},
    {'id': 'ac', 'name': 'AC Tech', 'urdu': 'اے سی', 'icon': Icons.ac_unit, 'color': Colors.cyan},
    {'id': 'bike', 'name': 'Bike Mech', 'urdu': 'موٹر سائیکل', 'icon': Icons.two_wheeler, 'color': Colors.teal},
    {'id': 'car', 'name': 'Car Mech', 'urdu': 'گاڑی', 'icon': Icons.directions_car, 'color': Colors.redAccent},
    {'id': 'carpenter', 'name': 'Carpenter', 'urdu': 'بڑھئی', 'icon': Icons.carpenter, 'color': Colors.brown},
  ];

  final List<Map<String, dynamic>> _rates = [
    {'title': 'Switch Board Repair & Check', 'price': 300, 'time': '20-30 min'},
    {'title': 'Ceiling Fan Repair & Capacitor', 'price': 450, 'time': '30-40 min'},
    {'title': 'Short Circuit Fault Tracing', 'price': 650, 'time': '45-60 min'},
    {'title': 'UPS & Inverter Battery Maintenance', 'price': 800, 'time': '40 min'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ustad Online • استاد آن لائن'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Color(0xFF10B981)),
            onPressed: () {},
          )
        ],
      ),
      body: SingleViewWrapper(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Location Header Banner
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on, color: Color(0xFF10B981)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'YOUR FAISALABAD LOCATION',
                          style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          _selectedLocation,
                          style: const TextStyle(fontSize: 13, color: Colors.white, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
                ],
              ),
            ),

            // Service Category Grid
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Select Handyman Service',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 100,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 10),
                itemBuilder: (context, i) {
                  final cat = _categories[i];
                  final isSelected = _selectedCategory == cat['id'];
                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategory = cat['id']),
                    child: Container(
                      width: 90,
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF064E3B) : const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected ? const Color(0xFF10B981) : Colors.transparent,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(cat['icon'], color: cat['color'], size: 28),
                          const SizedBox(height: 6),
                          Text(
                            cat['name'],
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          Text(
                            cat['urdu'],
                            style: const TextStyle(fontSize: 9, color: Color(0xFF10B981)),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            // Fixed Rate Card Section
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Text(
                    'Fixed Price Menu (PKR)',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  Text(
                    '100% Fixed Guarantee',
                    style: TextStyle(fontSize: 11, color: Color(0xFF10B981), fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            ..._rates.map((item) {
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white10),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.bolt, color: Color(0xFF10B981), size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item['title'],
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Estimated Time: ${item['time']}',
                            style: const TextStyle(fontSize: 11, color: Colors.grey),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'Rs. ${item['price']}',
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF10B981),
                          ),
                        ),
                        const Text(
                          'Fixed Rate',
                          style: TextStyle(fontSize: 9, color: Colors.grey),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),

            const SizedBox(height: 30),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        color: const Color(0xFF0F172A),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF10B981),
            foregroundColor: const Color(0xFF0F172A),
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Dispatching nearest verified Ustad in Faisalabad...'),
                backgroundColor: Color(0xFF10B981),
              ),
            );
          },
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.flash_on, color: Color(0xFF0F172A)),
              SizedBox(width: 8),
              Text(
                'BOOK USTAD NOW (DOORSTEP VISIT)',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SingleViewWrapper extends StatelessWidget {
  final Widget child;
  const SingleViewWrapper({super.key, required this.child});
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(child: child);
  }
}
