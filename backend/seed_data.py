import sys
import os

# Add parent directory to path so app modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.models.account import Account
from app.models.contact import Contact
from app.models.tech_spec import TechnicalSpec
from app.models.opportunity import Opportunity
from app.models.sample import SampleRequest
from app.models.activity import Activity

def seed():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if data already exists
    if db.query(Account).count() > 0:
        print("Database already contains data. Skipping seeding.")
        db.close()
        return

    print("Seeding high-precision accounts...")
    accounts_data = [
        Account(
            name="Ericsson Mobile Networks",
            type="OEM",
            industry="Telecommunications",
            tier="Strategic",
            website="https://www.ericsson.com",
            phone="+46 10 719 00 00",
            email="sourcing.radio@ericsson.com",
            address="Torshamnsgatan 21, Kista, Stockholm, Sweden",
            region="EMEA",
            notes="Global Tier-1 5G O-RAN and massive MIMO base station provider. Strict jitter and holdover specs."
        ),
        Account(
            name="Nokia Mobile Networks",
            type="OEM",
            industry="Telecommunications",
            tier="Strategic",
            website="https://www.nokia.com",
            phone="+358 10 44 88 000",
            email="procurement.timing@nokia.com",
            address="Karakaari 7, 02610 Espoo, Finland",
            region="EMEA",
            notes="Active evaluations for AirScale baseband synchronization using IEEE 1588 PTP v2.1."
        ),
        Account(
            name="Celestica Cloud Solutions",
            type="ODM",
            industry="Datacenter / AI",
            tier="Tier 1",
            website="https://www.celestica.com",
            phone="+1 416 448 5800",
            email="hw.procure@celestica.com",
            address="844 Don Mills Rd, North York, ON, Canada",
            region="North America",
            notes="Tier-1 white-box server and switch manufacturing partner for hyperscale AI datacenters."
        ),
        Account(
            name="Keysight Technologies",
            type="OEM",
            industry="Instrumentation",
            tier="Tier 1",
            website="https://www.keysight.com",
            phone="+1 800 829 4444",
            email="rf.components@keysight.com",
            address="1400 Fountaingrove Pkwy, Santa Rosa, CA, USA",
            region="North America",
            notes="High-end spectrum analyzers and RF test fixtures requiring ultra-low close-in phase noise."
        ),
        Account(
            name="Viasat Government Systems",
            type="OEM",
            industry="Aerospace & Defense",
            tier="Strategic",
            website="https://www.viasat.com",
            phone="+1 760 476 2200",
            email="gov.sourcing@viasat.com",
            address="6155 El Camino Real, Carlsbad, CA, USA",
            region="North America",
            notes="Satellite terminals requiring CSAC atomic holdover in GPS-denied environments."
        ),
        Account(
            name="Arrow Electronics (Global Distribution)",
            type="Distributor",
            industry="Electronic Components Distribution",
            tier="Strategic",
            website="https://www.arrow.com",
            phone="+1 800 777 2776",
            email="semis.emea@arrow.com",
            address="9201 E Dry Creek Rd, Centennial, CO, USA",
            region="North America",
            notes="Primary authorized distributor handling European & North American telecom accounts fulfillment."
        ),
        Account(
            name="Avnet Asia-Pacific",
            type="Distributor",
            industry="Electronic Components Distribution",
            tier="Tier 1",
            website="https://www.avnet.com",
            phone="+65 6580 6000",
            email="asia.inquiry@avnet.com",
            address="151 Lorong Chuan, New Tech Park, Singapore",
            region="APAC",
            notes="Fulfillment and supply chain financing for Asian manufacturing sites and ODMs."
        ),
    ]
    db.add_all(accounts_data)
    db.commit()

    print("Seeding contacts...")
    contacts_data = [
        Contact(
            account_id=accounts_data[0].id,
            first_name="Lars",
            last_name="Lindqvist",
            title="Chief Hardware Architect (Timing Systems)",
            role_category="Engineering Lead",
            email="lars.lindqvist@ericsson.com",
            phone="+46 70 123 4567",
            is_primary=True,
            notes="Key technical decision maker for 5G DU synchronization."
        ),
        Contact(
            account_id=accounts_data[0].id,
            first_name="Helena",
            last_name="Berg",
            title="Global Strategic Sourcing Director",
            role_category="Procurement",
            email="helena.berg@ericsson.com",
            phone="+46 70 987 6543",
            is_primary=False,
            notes="Handles contract negotiations and volume allocation."
        ),
        Contact(
            account_id=accounts_data[1].id,
            first_name="Mikko",
            last_name="Virtanen",
            title="Lead RF & Clocking Engineer",
            role_category="Engineering Lead",
            email="mikko.virtanen@nokia.com",
            phone="+358 40 555 1234",
            is_primary=True,
            notes="Evaluated our EVT samples in Espoo lab with positive holdover results."
        ),
        Contact(
            account_id=accounts_data[2].id,
            first_name="Raymond",
            last_name="Chen",
            title="Senior Director of Hardware Engineering",
            role_category="Executive",
            email="rchen@celestica.com",
            phone="+1 416 555 7890",
            is_primary=True,
            notes="Managing 800G AI switch reference design."
        ),
        Contact(
            account_id=accounts_data[3].id,
            first_name="Sarah",
            last_name="Miller",
            title="Principal Metrology Engineer",
            role_category="Engineering Lead",
            email="sarah.miller@keysight.com",
            phone="+1 707 555 3321",
            is_primary=True,
            notes="Focusing on 100Hz phase noise floor testing."
        ),
        Contact(
            account_id=accounts_data[4].id,
            first_name="David",
            last_name="Garrison",
            title="Defense Systems Sourcing Manager",
            role_category="Procurement",
            email="david.garrison@viasat.com",
            phone="+1 760 555 9944",
            is_primary=True,
            notes="Requires ITAR / Mil-STD-810H qualification certificates."
        )
    ]
    db.add_all(contacts_data)
    db.commit()

    print("Seeding specialized technical specifications...")
    specs_data = [
        TechnicalSpec(
            part_number="OCXO-10M-HC40-LP",
            category="OCXO",
            description="Ultra-Low Phase Noise 10.000 MHz Oven Controlled Crystal Oscillator in HC40 enclosure.",
            nominal_frequency="10.000 MHz",
            frequency_stability="±0.1 ppb",
            phase_noise_10hz=-118.0,
            phase_noise_100hz=-145.0,
            phase_noise_1khz=-162.0,
            phase_noise_10khz=-168.0,
            phase_noise_100khz=-172.0,
            phase_noise_1mhz=-174.0,
            jitter_spec="< 35 fs RMS (12kHz - 20MHz)",
            supply_voltage="3.3V",
            output_logic="Sine Wave",
            package_type="HC40",
            operating_temp_range="-40°C to +85°C",
            target_application="IEEE 1588 PTP Grandmaster",
            datasheet_url="https://datasheets.example.com/OCXO-10M-HC40-LP.pdf"
        ),
        TechnicalSpec(
            part_number="TCXO-122M-7050-LJ",
            category="TCXO",
            description="High Frequency 122.880 MHz Stratum 3 Compliant Low Jitter TCXO for 5G Baseband.",
            nominal_frequency="122.880 MHz",
            frequency_stability="±0.28 ppm",
            phase_noise_10hz=-92.0,
            phase_noise_100hz=-122.0,
            phase_noise_1khz=-146.0,
            phase_noise_10khz=-156.0,
            phase_noise_100khz=-162.0,
            phase_noise_1mhz=-165.0,
            jitter_spec="< 48 fs RMS",
            supply_voltage="3.3V",
            output_logic="LVPECL",
            package_type="SMD 7050",
            operating_temp_range="-40°C to +105°C",
            target_application="5G Infrastructure",
            datasheet_url="https://datasheets.example.com/TCXO-122M-7050-LJ.pdf"
        ),
        TechnicalSpec(
            part_number="CSAC-10M-ATOMIC-GEN2",
            category="CSAC / Atomic",
            description="Miniature Chip Scale Atomic Clock offering ultra-stable holdover for GNSS-denied navigation.",
            nominal_frequency="10.000 MHz",
            frequency_stability="±0.05 ppb",
            phase_noise_10hz=-90.0,
            phase_noise_100hz=-125.0,
            phase_noise_1khz=-145.0,
            phase_noise_10khz=-155.0,
            phase_noise_100khz=-160.0,
            phase_noise_1mhz=-162.0,
            jitter_spec="< 100 fs RMS",
            supply_voltage="3.3V",
            output_logic="CMOS",
            package_type="CSAC",
            operating_temp_range="-10°C to +70°C",
            target_application="Aerospace & Defense",
            datasheet_url="https://datasheets.example.com/CSAC-10M-ATOMIC-GEN2.pdf"
        ),
        TechnicalSpec(
            part_number="VCXO-156M-5032-DIFF",
            category="VCXO",
            description="Ultra-Low Jitter Differential Voltage Controlled Crystal Oscillator for 800G AI Ethernet.",
            nominal_frequency="156.250 MHz",
            frequency_stability="±15 ppm",
            phase_noise_10hz=-88.0,
            phase_noise_100hz=-118.0,
            phase_noise_1khz=-142.0,
            phase_noise_10khz=-154.0,
            phase_noise_100khz=-160.0,
            phase_noise_1mhz=-163.0,
            jitter_spec="< 30 fs RMS",
            supply_voltage="3.3V",
            output_logic="LVDS",
            package_type="SMD 5032",
            operating_temp_range="-40°C to +85°C",
            target_application="Datacenter AI Timing",
            datasheet_url="https://datasheets.example.com/VCXO-156M-5032-DIFF.pdf"
        ),
    ]
    db.add_all(specs_data)
    db.commit()

    print("Seeding high-tech design-win opportunities...")
    opps_data = [
        Opportunity(
            title="Ericsson 5G O-RAN DU PTP Synchronization Clock",
            project_code="PRJ-ERI-ORAN-01",
            account_id=accounts_data[0].id,
            partner_account_id=accounts_data[5].id, # Arrow Electronics
            primary_contact_id=contacts_data[0].id,
            tech_spec_id=specs_data[0].id,
            stage="3_sample_evaluation",
            estimated_revenue=650000.0,
            annual_volume_units=25000,
            currency="USD",
            confidence_percentage=75,
            target_mp_date="2026-Q1",
            target_application="IEEE 1588 PTP",
            description="Primary reference clock for next-generation O-RAN Distributed Unit (DU). Customer requires < 1.5 microsecond holdover over 24 hours.",
            competitor_notes="Competing against Rakon and Microchip. Our close-in phase noise (-118 dBc/Hz @ 10Hz) provides a significant thermal-gradient advantage."
        ),
        Opportunity(
            title="Ericsson Massive MIMO Radio Unit Local Oscillator",
            project_code="PRJ-ERI-MMIMO-02",
            account_id=accounts_data[0].id,
            partner_account_id=accounts_data[5].id, # Arrow Electronics
            primary_contact_id=contacts_data[0].id,
            tech_spec_id=specs_data[1].id,
            stage="2_tech_discovery",
            estimated_revenue=820000.0,
            annual_volume_units=40000,
            currency="USD",
            confidence_percentage=50,
            target_mp_date="2026-Q2",
            target_application="5G Infrastructure",
            description="Parallel project for active antenna array frequency conversion.",
            competitor_notes="Evaluated against Epson and NDK."
        ),
        Opportunity(
            title="Nokia AirScale Baseband Primary Oscillator",
            project_code="PRJ-NOK-BBU-01",
            account_id=accounts_data[1].id,
            partner_account_id=accounts_data[5].id, # Arrow Electronics
            primary_contact_id=contacts_data[2].id,
            tech_spec_id=specs_data[1].id,
            stage="4_design_win",
            estimated_revenue=980000.0,
            annual_volume_units=60000,
            currency="USD",
            confidence_percentage=90,
            target_mp_date="2025-Q4",
            target_application="5G Infrastructure",
            description="Formally approved on BOM as primary source after successful DVT temperature chamber test completion.",
            competitor_notes="Sole-source approved. Customer locked architecture to our SMD 7050 footprint."
        ),
        Opportunity(
            title="Celestica 800G AI Switch Master Clock Reference",
            project_code="PRJ-CLS-800G-01",
            account_id=accounts_data[2].id,
            partner_account_id=accounts_data[6].id, # Avnet APAC
            primary_contact_id=contacts_data[3].id,
            tech_spec_id=specs_data[3].id,
            stage="2_tech_discovery",
            estimated_revenue=420000.0,
            annual_volume_units=30000,
            currency="USD",
            confidence_percentage=45,
            target_mp_date="2026-Q2",
            target_application="Datacenter AI Timing",
            description="Reference clock for Broadcom Tomahawk 5 based 800G switch fabric. Customer needs sub-35fs jitter.",
            competitor_notes="SiTime offering MEMS alternative; customer prefers our lower phase jitter floor."
        ),
        Opportunity(
            title="Viasat Tactical Terminal GNSS-Denied Holdover Unit",
            project_code="PRJ-VIA-TACT-01",
            account_id=accounts_data[4].id,
            partner_account_id=None, # Direct OEM
            primary_contact_id=contacts_data[5].id,
            tech_spec_id=specs_data[2].id,
            stage="5_mass_production",
            estimated_revenue=1250000.0,
            annual_volume_units=1500,
            currency="USD",
            confidence_percentage=100,
            target_mp_date="2025-Q2",
            target_application="Aerospace & Defense",
            description="Ongoing mass production deliveries for tactical satellite manpack terminals.",
            competitor_notes="Long-term multi-year defense supply contract."
        ),
        Opportunity(
            title="Keysight High-End Signal Generator Timebase",
            project_code="PRJ-KEY-SIG-01",
            account_id=accounts_data[3].id,
            partner_account_id=None,
            primary_contact_id=contacts_data[4].id,
            tech_spec_id=specs_data[0].id,
            stage="1_lead",
            estimated_revenue=310000.0,
            annual_volume_units=5000,
            currency="USD",
            confidence_percentage=25,
            target_mp_date="2026-Q3",
            target_application="Instrumentation",
            description="Initial inquiry for next generation RF signal generator internal reference oscillator.",
            competitor_notes="Evaluating Wenzel and our HC40 solution."
        )
    ]
    db.add_all(opps_data)
    db.commit()

    print("Seeding sample requests & evaluations...")
    samples_data = [
        SampleRequest(
            opportunity_id=opps_data[0].id,
            tech_spec_id=specs_data[0].id,
            sample_batch_code="SMP-2025-EVT-01",
            quantity=5,
            status="testing",
            carrier="DHL Express",
            tracking_number="DHL-9842187391",
            dispatch_date="2025-09-12",
            delivery_date="2025-09-15",
            test_phase="EVT",
            lab_test_results="Initial bench testing in Stockholm lab confirmed Phase Noise: -145 dBc/Hz @ 100Hz. Allan Deviation tests currently running in climate chamber.",
            customer_feedback="Lars Lindqvist reported that early holdover drift is within 1.1us, beating the 1.5us requirement.",
            next_action="Awaiting completion of 30-day thermal stress test on October 30."
        ),
        SampleRequest(
            opportunity_id=opps_data[2].id, # Nokia opp
            tech_spec_id=specs_data[1].id,
            sample_batch_code="SMP-2025-DVT-04",
            quantity=20,
            status="passed",
            carrier="FedEx Priority",
            tracking_number="FDX-7741289943",
            dispatch_date="2025-08-01",
            delivery_date="2025-08-03",
            test_phase="DVT",
            lab_test_results="Full DVT qualification complete across -40°C to +105°C. Jitter measured at 42 fs RMS. Soldering reflow profile passed JEDEC standard.",
            customer_feedback="Formal DVT sign-off signed by Nokia Engineering. Part added to approved vendor list (AVL).",
            next_action="Prepare PVT pilot production run and initiate long-lead raw material booking."
        ),
        SampleRequest(
            opportunity_id=opps_data[3].id, # Celestica opp
            tech_spec_id=specs_data[3].id,
            sample_batch_code="SMP-2025-PROTO-09",
            quantity=10,
            status="preparing",
            carrier="UPS Worldwide",
            tracking_number="UPS-1Z9999999999999999",
            dispatch_date="2025-10-28",
            delivery_date=None,
            test_phase="EVT",
            lab_test_results="Pre-shipment testing showed jitter at 28 fs RMS, meeting Celestica requirements.",
            customer_feedback="Customer ready to test upon arrival on their prototype switch board.",
            next_action="Ship out batch via UPS on scheduled date."
        )
    ]
    db.add_all(samples_data)
    db.commit()

    print("Seeding interaction history and meeting details...")
    activities_data = [
        Activity(
            opportunity_id=opps_data[0].id,
            account_id=accounts_data[0].id,
            contact_id=contacts_data[0].id,
            activity_type="Lab Visit",
            activity_date="2025-09-18",
            title="Kista R&D Lab - Phase Noise & Thermal Gradient Review",
            attendees="Lars Lindqvist (Ericsson), Johan Ek (Arrow FAE), Dave (Our FAE)",
            summary="Reviewed Allan deviation setup on 10MHz OCXO. Customer confirmed our close-in phase noise (-118 dBc/Hz @ 10Hz) completely eliminated micro-vibration sidebands on the baseband board.",
            action_items="Provide thermal shock simulation report for -40C to +85C step ramp by Oct 5.",
            follow_up_date="2025-10-05"
        ),
        Activity(
            opportunity_id=opps_data[0].id,
            account_id=accounts_data[0].id,
            contact_id=contacts_data[1].id,
            activity_type="Phone Call",
            activity_date="2025-10-12",
            title="Commercial Terms & Arrow Disti Fulfillment Alignment",
            attendees="Helena Berg (Ericsson Procurement), Carl (Arrow Account Mgr), Ming (Sales)",
            summary="Aligned on 25k unit volume tiered pricing. Arrow confirmed willingness to buffer 60 days of finished stock in their Frankfurt warehouse to meet Ericsson pull signals.",
            action_items="Send draft 3-way distribution fulfillment agreement.",
            follow_up_date="2025-10-25"
        ),
        Activity(
            opportunity_id=opps_data[2].id, # Nokia
            account_id=accounts_data[1].id,
            contact_id=contacts_data[2].id,
            activity_type="Meeting (F2F)",
            activity_date="2025-08-15",
            title="Espoo HQ - DVT Sign-off and PVT Pilot Ramp Meeting",
            attendees="Mikko Virtanen (Nokia RF Lead), Arrow Nordic Team, Our Management",
            summary="Formal engineering sign-off meeting. All DVT thermal chamber tests passed with zero frequency dropouts. Nokia locked our SMD 7050 part number onto the AirScale revision C schematic.",
            action_items="Lock lead times for 5k piece PVT batch delivery in December.",
            follow_up_date="2025-09-01"
        ),
        Activity(
            opportunity_id=opps_data[3].id, # Celestica
            account_id=accounts_data[2].id,
            contact_id=contacts_data[3].id,
            activity_type="Video Conference",
            activity_date="2025-10-20",
            title="800G Switch Reference Board Layout Review",
            attendees="Raymond Chen (Celestica Hardware Dir), Avnet Technical Team",
            summary="Reviewed differential trace impedance and 3.3V supply decoupling for the 156.250 MHz VCXO. Customer requested additional phase jitter integration plot from 10kHz to 20MHz.",
            action_items="Email phase jitter spectral density graph by end of week.",
            follow_up_date="2025-10-24"
        )
    ]
    db.add_all(activities_data)
    db.commit()

    print("Database successfully seeded with realistic high-precision CRM data!")
    db.close()

if __name__ == "__main__":
    seed()
