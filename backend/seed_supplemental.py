from app.core.database import SessionLocal
from app.models.account import Account
from app.models.opportunity import Opportunity
from app.models.contact import Contact
from app.models.tech_spec import TechnicalSpec
from app.models.activity import Activity

db = SessionLocal()

arrow = db.query(Account).filter(Account.name.like("%Arrow%")).first()
if not arrow:
    arrow = Account(
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
    )
    db.add(arrow)
    db.flush()

avnet = db.query(Account).filter(Account.name.like("%Avnet%")).first()
if not avnet:
    avnet = Account(
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
    )
    db.add(avnet)
    db.flush()

db.commit()

ericsson = db.query(Account).filter(Account.name.like("%Ericsson%")).first()
nokia = db.query(Account).filter(Account.name.like("%Nokia%")).first()
celestica = db.query(Account).filter(Account.name.like("%Celestica%")).first()

opp1 = db.query(Opportunity).filter(Opportunity.account_id == ericsson.id).first() if ericsson else None
if opp1:
    opp1.project_code = "PRJ-5G-DU-01"
    opp1.partner_account_id = arrow.id

opp2 = db.query(Opportunity).filter(Opportunity.account_id == nokia.id).first() if nokia else None
if opp2:
    opp2.project_code = "PRJ-AIRSCALE-02"
    opp2.partner_account_id = arrow.id

opp3 = db.query(Opportunity).filter(Opportunity.account_id == celestica.id).first() if celestica else None
if opp3:
    opp3.project_code = "PRJ-800G-SW-03"
    opp3.partner_account_id = avnet.id

parallel_opp = db.query(Opportunity).filter(Opportunity.project_code == "PRJ-5G-RU-02").first()
if not parallel_opp and ericsson:
    spec = db.query(TechnicalSpec).first()
    contact = db.query(Contact).filter(Contact.account_id == ericsson.id).first()
    parallel_opp = Opportunity(
        title="Ericsson 5G Massive-MIMO Remote Radio Unit (RRU) Local Oscillator",
        project_code="PRJ-5G-RU-02",
        account_id=ericsson.id,
        partner_account_id=arrow.id,
        primary_contact_id=contact.id if contact else None,
        tech_spec_id=spec.id if spec else None,
        stage="2_tech_discovery",
        estimated_revenue=820000.0,
        annual_volume_units=40000,
        currency="USD",
        confidence_percentage=50,
        target_mp_date="2026-Q2",
        target_application="5G RRU Massive MIMO",
        description="Parallel program with Ericsson Kista team for 64T64R massive MIMO radio unit local oscillator.",
        competitor_notes="Competing against NDK."
    )
    db.add(parallel_opp)
    db.flush()

db.commit()

if db.query(Activity).count() == 0 and opp1:
    act1 = Activity(
        opportunity_id=opp1.id,
        account_id=ericsson.id,
        activity_type="Lab Visit",
        activity_date="2025-09-18",
        title="Kista R&D Lab - Phase Noise & Thermal Gradient Review",
        attendees="Lars Lindqvist (Ericsson), Johan Ek (Arrow FAE), Dave (Our FAE)",
        summary="Reviewed Allan deviation setup on 10MHz OCXO. Customer confirmed our close-in phase noise (-118 dBc/Hz @ 10Hz) completely eliminated micro-vibration sidebands on the baseband board.",
        action_items="Provide thermal shock simulation report for -40C to +85C step ramp by Oct 5.",
        follow_up_date="2025-10-05"
    )
    act2 = Activity(
        opportunity_id=opp1.id,
        account_id=ericsson.id,
        activity_type="Phone Call",
        activity_date="2025-10-12",
        title="Commercial Terms & Arrow Disti Fulfillment Alignment",
        attendees="Helena Berg (Ericsson Procurement), Carl (Arrow Account Mgr), Ming (Sales)",
        summary="Aligned on 25k unit volume tiered pricing. Arrow confirmed willingness to buffer 60 days of finished stock in their Frankfurt warehouse to meet Ericsson pull signals.",
        action_items="Send draft 3-way distribution fulfillment agreement.",
        follow_up_date="2025-10-25"
    )
    db.add_all([act1, act2])
    if opp2 and nokia:
        act3 = Activity(
            opportunity_id=opp2.id,
            account_id=nokia.id,
            activity_type="Meeting (F2F)",
            activity_date="2025-08-15",
            title="Espoo HQ - DVT Sign-off and PVT Pilot Ramp Meeting",
            attendees="Mikko Virtanen (Nokia RF Lead), Arrow Nordic Team, Our Management",
            summary="Formal engineering sign-off meeting. All DVT thermal chamber tests passed with zero frequency dropouts. Nokia locked our SMD 7050 part number onto the AirScale revision C schematic.",
            action_items="Lock lead times for 5k piece PVT batch delivery in December.",
            follow_up_date="2025-09-01"
        )
        db.add(act3)
    db.commit()

print("SUPPLEMENTAL_SEED_SUCCESS")
db.close()
