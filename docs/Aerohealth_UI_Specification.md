# Aerohealth UI/UX Specification

## Product

Aerohealth
Predictive Maintenance Intelligence

## Product Positioning

Aerohealth is a research-oriented predictive-maintenance platform demonstrating Remaining Useful Life estimation from aircraft engine telemetry.

The interface must communicate both:
- a premium aerospace technology product
- a rigorous machine-learning research prototype

The interface must never imply aviation certification, guaranteed failure prediction, or maintenance authorization.

---

# 1. Product Experience

The product has two connected experiences.

## Public Experience

Purpose:
- Explain Aerohealth
- Establish the problem
- Demonstrate the technology
- Invite users into the platform
- Provide access to the research

Primary CTA:
Explore Aerohealth

Secondary CTA:
Explore the Research

## Platform Experience

Purpose:
- Explore engine predictions
- Understand model outputs
- Inspect telemetry
- Understand the methodology
- Explore research evidence

---

# 2. Navigation

Primary navigation:

- Overview
- Engines
- Predictions
- Research
- Methodology

Secondary actions:

- Explore Aerohealth
- Explore Research

---

# 3. Landing Page

## Hero

Headline:

Predict what remains.
Understand what changed.

Supporting statement:

Machine-learning-based Remaining Useful Life estimation from aircraft engine telemetry.

Primary CTA:

Explore Aerohealth

Secondary CTA:

Explore the Research

Visual direction:

- premium aerospace imagery
- turbofan or aircraft visual
- dark cinematic environment
- technical telemetry overlays
- subtle grid structures
- large editorial typography
- minimal navigation
- restrained motion

---

# 4. Platform Overview

Display:

- Number of test engines
- Model name
- Feature count
- Validation metrics
- Official test metrics
- Engine prediction distribution

Core research facts:

100 test engines

78 predictive features

LightGBM quantile regression

Alpha = 0.40

---

# 5. Engine Explorer

User selects an engine from 1 to 100.

Display:

Engine ID

Current cycle

Estimated RUL

Historical telemetry

RUL trajectory

Relevant model features

Prediction explanation

Methodology context

---

# 6. Prediction Card

The prediction card must clearly distinguish model output from interpretation.

Example:

Estimated Remaining Useful Life

3.65 cycles

Supporting text:

Aerohealth estimates approximately 3.65 operating cycles of remaining useful life based on the learned patterns represented in the FD001 model.

Limitation:

This is a model estimate, not a guaranteed failure time or maintenance authorization.

---

# 7. Prediction Explanation

The explanation layer contains:

## Model Output

The numerical RUL prediction.

## Model Evidence

Features and temporal patterns associated with the prediction.

## Human Interpretation

A plain-language explanation of what the prediction means.

## Limitation

Explicitly communicate that the model does not provide a certified maintenance decision.

The interface must never state that an engine will definitely fail at the predicted cycle.

---

# 8. Research Mode

Sections:

- Dataset
- Problem formulation
- Data processing
- Sensor analysis
- Feature engineering
- Experimental design
- Models
- Validation
- Official test evaluation
- Error analysis
- Sensitivity analysis
- Reproducibility
- Limitations

---

# 9. Methodology

Frozen predictive representation:

78 features

Components:

- 2 operational settings
- 15 raw variable sensors
- 15 five-cycle rolling means
- 15 five-cycle rolling standard deviations
- 15 first differences
- 1 cycle-age feature
- 15 causal ten-cycle trend features

RUL target:

RUL = final_cycle - current_cycle

Validation:

80 training engines

20 validation engines

random_state = 42

Final model:

LightGBM quantile regression

n_estimators = 300
num_leaves = 31
learning_rate = 0.05
subsample = 0.8
colsample_bytree = 0.8
alpha = 0.40

---

# 10. Visual Design

## Color System

Deep Space Black:
#05070A

Graphite:
#10151B

Aero White:
#F4F7FA

Muted Steel:
#8D99A6

Technical Cyan:
#36D9FF

Signal Blue:
#4D7CFE

Warning Amber:
#FFB547

Amber indicates attention in the interface and must not be interpreted as a certified maintenance condition.

## Typography

Use a modern technical sans-serif.

Priorities:

- strong display hierarchy
- highly readable numerical values
- compact technical labels
- clear data visualization typography

## Motion

Animations should communicate:

data -> transition -> interpretation

Avoid unnecessary decorative animation.

---

# 11. Application Architecture

Frontend:

Premium interactive web interface.

Backend:

API layer connected to the verified Aerohealth inference pipeline.

Research core:

src/data_loader.py
src/features.py
src/model.py
src/evaluation.py
src/inference.py

The research core must remain independently executable.

The application must consume the verified inference layer rather than duplicate the modeling logic.

---

# 12. Design Principles

1. Research before decoration.
2. Evidence before interpretation.
3. Prediction is not diagnosis.
4. Prediction is not maintenance authorization.
5. Every important number should have context.
6. Technical depth should be available without overwhelming first-time users.
7. The interface should feel like an aerospace intelligence platform, not a generic ML dashboard.
8. The application must preserve the scientific limitations of the underlying dataset and model.