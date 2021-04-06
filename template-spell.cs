public class SpellCast{{:spell.id}} : SpellCastCharge {
    public bool active;
    // Load() is called when the spell is selected from the spell wheel.
    // Note that the instance of this class is destroyed when the spell is deselected.
    public override void Load() {
        base.Load();

    }

    // Fire() is called both when the player starts casting the spell, and when they stop.
    // If active is true, the player has started to cast the spell. If it's false,
    //  they're releasing it.
    public override void Fire(bool active) {
        base.Fire(active);
        this.active = active;
        if (active) {
            // Spell has just been cast
            // ...
        } else {
            // Spell has just been released
            // ...
        }
    }

    public override void UpdateCaster() {
        base.UpdateCaster();
        if (active) {
            // Your code here ...
        }
    }

    {{if spell.spray}}// OnSprayStart() is called when the player starts to spray the spell.
    public override void OnSprayStart() {
        base.OnSprayStart();
    }

    // OnSprayEnd() is called one per frame while the player is spraying the spell.
    public override void OnSprayLoop() {
        base.OnSprayLoop();
    }

    // OnSprayEnd() is called when the player stops spraying the spell.
    public override void OnSprayEnd() {
        base.OnSprayEnd();
    }{{/if}}

    {{if spell.throw}}// Throw() is called when the player throws the spell - i.e., when the player
    //  releases the spell while their hand is moving relatively fast.
    public override void Throw(Vector3 velocity) {
        base.Throw(velocity);
    }{{/if}}
}


