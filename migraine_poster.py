from mflux.models.flux2.variants import Flux2Klein
from mflux.models.common.config import ModelConfig
import datetime

model = Flux2Klein(model_config=ModelConfig.flux2_klein_4b())
image = model.generate_image(
    prompt="Professional medical poster, single panel Google My Business format, migraine medicines theme. Clean modern design with blue and white and teal color scheme. Title at top: 'Migraine Medicines' in bold white text on blue banner. Three clearly labeled sections with icons: 1) Acute Treatment section with pill icons and list: Triptans, NSAIDs, Acetaminophen 2) Preventive Treatment section with brain icon and list: Beta-blockers, CGRP monoclonal antibodies, Antidepressants 3) Red Flags section with medical cross icon and warning text: Sudden severe headache, Visual changes, Persistent symptoms - See a doctor. Bottom: Medical cross symbol, brain icon, pharmacy icon. Professional neurologist clinic social media post aesthetic. Light blue gradient background. Modern healthcare typography.",
    num_inference_steps=4,
    width=768,
    height=1024,
    seed=42,
)
today = datetime.date.today().strftime("%Y%m%d")
image.save(f"/Users/bobvarkey/.openclaw/workspace/migraine_poster_{today}.png")
print(f"Saved migraine_poster_{today}.png")
